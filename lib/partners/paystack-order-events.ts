import { holdWalletCredit } from './wallet';
import 'server-only';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { commitVerifiedCustomerPayment } from './order-workflow';

export async function verifyPartnerPayment(reference: string) {
  const key = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY || '';
  if (!key.startsWith('sk_live_') || !/^PCO_[a-f0-9-]{36}$/.test(reference))
    throw new Error('Verification unavailable.');
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    },
  );
  const result = await response.json();
  if (!response.ok || result.status !== true || !result.data)
    throw new Error('Verification unavailable.');
  const data = result.data;
  return commitVerifiedCustomerPayment(reference, {
    status: String(data.status),
    reference: String(data.reference),
    amount: Number(data.amount),
    currency: String(data.currency),
    domain: String(data.domain),
    orderId: String(data.metadata?.partnerCustomerOrderId || ''),
    transactionId: String(data.id),
  });
}

export async function handlePartnerPaystackEvent(
  raw: string,
  signature: string,
) {
  const key = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY || '';
  if (!key.startsWith('sk_live_'))
    return Response.json(
      { message: 'Partner payment verification is not configured.' },
      { status: 503 },
    );
  const expected = createHmac('sha512', key).update(raw).digest('hex');
  if (
    !/^[a-f0-9]{128}$/i.test(signature) ||
    !timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex'),
    )
  )
    return Response.json({ message: 'Invalid signature.' }, { status: 401 });
  const event = JSON.parse(raw);
  const reference = String(
    event.data?.transaction?.reference || event.data?.reference || '',
  );
  if (!reference.startsWith('PCO_'))
    return Response.json(
      { message: 'Unrecognized partner reference.' },
      { status: 400 },
    );
  if (event.event === 'charge.success') {
    await verifyPartnerPayment(reference);
  } else if (
    [
      'refund.processed',
      'refund.pending',
      'refund.processing',
      'charge.dispute.create',
      'charge.dispute.remind',
      'charge.dispute.resolve',
    ].includes(event.event)
  ) {
    // A dispute resolution is never automatic permission to release goods again.
    await prisma.$transaction(async (tx) => {
      const [row] = await tx.$queryRaw<
        Array<{
          id: string;
          partnerId: string;
          releasedOrderId: string | null;
          paymentStatus: string;
        }>
      >`SELECT id, partnerId, releasedOrderId, paymentStatus FROM procurement_partner_customer_orders WHERE checkoutReference = ${reference} FOR UPDATE`;
      if (!row || row.paymentStatus === 'REVERSED') return;
      await holdWalletCredit(
        tx,
        row.partnerId,
        row.id,
        event.event === 'refund.processed',
        'PAYSTACK',
      );
      const status =
        event.event === 'refund.processed' ? 'REVERSED' : 'DISPUTED';
      await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET paymentStatus = ${status}, partnerReview = 'REVIEW_REQUIRED', updatedAt = NOW(3) WHERE id = ${row.id}`;
      await tx.payments.updateMany({
        where: { txRef: reference, serviceName: 'PARTNER_PROCUREMENT' },
        data: { paymentStatus: status, updatedAt: new Date() },
      });
      if (row.releasedOrderId)
        await tx.orders.updateMany({
          where: {
            pidOrder: row.releasedOrderId,
            orderType: 'PARTNER_PROCUREMENT',
          },
          data: { status: 'on-hold', updatedAt: new Date() },
        });
      await tx.$executeRaw`INSERT INTO procurement_partner_order_events (id, customerOrderId, actorPid, action) VALUES (${randomUUID()}, ${row.id}, 'PAYSTACK', ${status})`;
    });
  }
  return Response.json({ received: true });
}
