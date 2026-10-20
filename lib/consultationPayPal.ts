import { validatePaypalSubscriptionPayment } from '@/lib/intelligence/paypalPolicy';
import { prisma } from '@/lib/prisma';
import {
  getPayPalOrder,
  capturePayPalOrder,
  getSureImportsPayPalEnvironment,
} from '@/lib/paypal';
import { assertPayPalOrderMatches } from '@/lib/paypalValidation';
import { fulfillConsultationPayment } from '@/lib/consultationFulfillment';
export const CONSULTATION_USD_CENTS = 5000;
export async function verifyPayPalConsultation(
  reference: string,
  capture = true,
) {
  const rows = await prisma.$queryRaw<
    {
      reference: string;
      pidBooking: string;
      providerReference: string;
      environment: string;
      currency: string;
      amountKobo: number;
    }[]
  >`SELECT c.*,b.currency,b.amountKobo FROM consultation_paypal_checkouts c JOIN consultation_bookings b ON b.pidBooking=c.pidBooking WHERE c.reference=${reference} LIMIT 1`;
  const checkout = rows[0];
  if (
    !checkout ||
    checkout.currency !== 'USD' ||
    checkout.amountKobo !== CONSULTATION_USD_CENTS ||
    checkout.environment !== getSureImportsPayPalEnvironment()
  )
    throw Error('PayPal booking payment was not found.');
  let order = await getPayPalOrder(checkout.providerReference);
  if (order.sureImportsEnvironment !== checkout.environment)
    throw Error('PayPal environment mismatch.');
  assertPayPalOrderMatches(order, {
    customId: checkout.pidBooking,
    amountMinor: CONSULTATION_USD_CENTS,
    currency: 'USD',
  });
  if (order.status === 'APPROVED' && capture)
    order = await capturePayPalOrder(checkout.providerReference);
  const payment = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (
    order.status !== 'COMPLETED' ||
    payment?.status !== 'COMPLETED' ||
    !payment.id
  )
    throw Error('PayPal has not confirmed the booking payment yet.');
  validatePaypalSubscriptionPayment({
    actualAmount: payment.amount?.value,
    currency: payment.amount?.currency_code,
    expectedMinor: CONSULTATION_USD_CENTS,
    status: payment.status,
  });
  if (checkout.environment !== 'live')
    throw Error(
      'Sandbox payment verified. No live booking or Zoom meeting has been created.',
    );
  await prisma.$executeRaw`UPDATE consultation_paypal_checkouts SET captureReference=${String(payment.id)} WHERE reference=${reference}`;
  return fulfillConsultationPayment({
    reference,
    status: 'success',
    amount: CONSULTATION_USD_CENTS,
    currency: 'USD',
    paid_at: payment.create_time,
    metadata: {
      product: 'sureimports_consultation',
      pidBooking: checkout.pidBooking,
    },
  });
}
export async function handleConsultationPayPalEvent(
  body: any,
  captureReference: string,
) {
  const event = String(body.event_type || '');
  const orderId = String(
    body.resource?.supplementary_data?.related_ids?.order_id ||
      (event === 'CHECKOUT.ORDER.APPROVED' ? body.resource?.id : '') ||
      '',
  );
  const rows = await prisma.$queryRaw<
    { reference: string; environment: string }[]
  >`SELECT reference,environment FROM consultation_paypal_checkouts WHERE environment=${getSureImportsPayPalEnvironment()} AND (providerReference=${orderId || '__none__'} OR captureReference=${captureReference || '__none__'}) LIMIT 1`;
  if (!rows[0]) return false;
  if (rows[0].environment !== 'live') return true;
  if (['CHECKOUT.ORDER.APPROVED', 'PAYMENT.CAPTURE.COMPLETED'].includes(event))
    await verifyPayPalConsultation(
      rows[0].reference,
      event === 'CHECKOUT.ORDER.APPROVED',
    );
  else if (
    [
      'PAYMENT.CAPTURE.REFUNDED',
      'PAYMENT.CAPTURE.REVERSED',
      'CUSTOMER.DISPUTE.CREATED',
      'CUSTOMER.DISPUTE.UPDATED',
    ].includes(event)
  ) {
    // Keep the meeting record for staff review rather than silently deleting a booked session.
    await prisma.$executeRaw`UPDATE consultation_bookings SET fulfillmentError=${`PayPal reported ${event}. Review this booking's payment before the session.`},updatedAt=NOW(3) WHERE paystackReference=${rows[0].reference}`;
  }
  return true;
}
