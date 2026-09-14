import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { createPayPalOrder, getPayPalOrder, capturePayPalOrder, getSureImportsPayPalEnvironment } from './paypal';
import { assertPayPalOrderMatches, assertPayPalLiveFulfillment } from './paypalValidation';
import xMail from '@/lib/email/xMail';

// The existing special-sourcing form quotes USD 20 (not a procurement deposit).
const FEE_MINOR = 2000;
export async function startSpecialSourcingPayPal(id: string, pidUser: string, origin: string) {
  const request = await prisma.special_sourcing.findUnique({ where: { pidSpecialSourcing: id } });
  if (!request || request.pidUser !== pidUser) throw Error('Sourcing request not found.');
  if (!['pending', 'pending-payment', 'saved'].includes(request.status || '')) throw Error('This request is not open for payment.');
  const previous = await prisma.payments.findFirst({ where: { serviceID: id, paymentStatus: 'PAID' } });
  if (previous) throw Error('This request has already been paid.');
  const environment = getSureImportsPayPalEnvironment();
  const pidPayment = 'PPSRC_' + createHash('sha256').update(`${environment}:${pidUser}:${id}`).digest('hex').slice(0, 32);
  const user = await prisma.users.findUnique({ where: { pidUser } });
  const row = await prisma.payments.upsert({ where: { pidPayment }, update: {}, create: {
    pidPayment, pidUser, payerName: `${user?.userFirstname || ''} ${user?.userLastname || ''}`.trim() || 'Customer',
    payerEmail: user?.userEmail, txID: pidPayment, txRef: pidPayment, paymentStatus: 'PENDING', paymentType: 'PAYPAL',
    currency: 'USD', amount: FEE_MINOR / 100, serviceID: id, serviceName: 'SPECIAL SOURCING',
    serviceDescription: 'Special sourcing research fee', paymentExt2: JSON.stringify({ environment }), updatedAt: new Date(),
  } });
  if (row.paymentStatus !== 'PENDING') throw Error('This payment requires review. Please do not pay again.');
  const returnPath = `/checkout/paypal/special-sourcing?request=${encodeURIComponent(id)}`;
  if (row.txRef !== pidPayment) {
    const { signPayPalCheckoutSession } = await import('./paypalCheckoutSession');
    const url = new URL('/checkout/paypal', origin);
    url.searchParams.set('session', signPayPalCheckoutSession({ orderId: row.txRef!, amount: '20.00', currency: 'USD', description: 'Special sourcing research fee', returnPath, cancelPath: '/dashboard/special-sourcing/pending', expiresAt: Date.now() + 7200000 }));
    return url.toString();
  }
  if (row.createdAt && Date.now() - row.createdAt.getTime() > 5 * 3600000) throw Error('This earlier payment needs reconciliation. Contact support before trying again.');
  const order = await createPayPalOrder({ amount: '20.00', currency: 'USD', customId: pidPayment, invoiceId: pidPayment, description: 'Special sourcing research fee', returnUrl: new URL(returnPath, origin).toString(), cancelUrl: new URL('/dashboard/special-sourcing/pending', origin).toString() });
  await prisma.payments.update({ where: { pidPayment }, data: { txRef: order.id, updatedAt: new Date() } });
  return order.approvalUrl;
}

export async function confirmSpecialSourcingPayPal(reference: string, pidUser?: string) {
  const payment = await prisma.payments.findFirst({ where: { txRef: reference, pidPayment: { startsWith: 'PPSRC_' }, paymentType: 'PAYPAL' } });
  if (!payment || (pidUser && payment.pidUser !== pidUser)) throw Error('Payment not found.');
  if (!['PENDING', 'PAID'].includes(payment.paymentStatus || '')) throw Error('Payment requires review. Please do not pay again.');
  let order = await getPayPalOrder(reference);
  const expected = { customId: payment.pidPayment, amountMinor: FEE_MINOR, currency: 'USD' };
  assertPayPalOrderMatches(order, expected);
  if (order.status === 'APPROVED') {
    const request = await prisma.special_sourcing.findUnique({ where: { pidSpecialSourcing: payment.serviceID! } });
    if (!request || request.pidUser !== payment.pidUser || !['pending', 'pending-payment', 'saved'].includes(request.status || '')) throw Error('The request changed. Payment was not captured.');
    order = await capturePayPalOrder(reference);
  }
  assertPayPalOrderMatches(order, expected);
  assertPayPalLiveFulfillment(order);
  const captures = order.purchase_units[0].payments?.captures;
  if (order.status !== 'COMPLETED' || !Array.isArray(captures) || captures.length !== 1 || !captures[0].id || captures[0].status !== 'COMPLETED' || captures[0].amount?.currency_code !== 'USD' || Math.round(Number(captures[0].amount?.value) * 100) !== FEE_MINOR) throw Error('Payment is not confirmed. Check your request before retrying.');
  await prisma.$transaction(async tx => {
    const [locked] = await tx.$queryRaw<Array<{paymentStatus:string}>>`SELECT paymentStatus FROM payments WHERE pidPayment = ${payment.pidPayment} FOR UPDATE`;
    if (locked?.paymentStatus === 'PAID') return;
    if (locked?.paymentStatus !== 'PENDING') throw Error('Payment requires review.');
    await tx.payments.update({ where: { pidPayment: payment.pidPayment }, data: { paymentStatus: 'PAID', txID: captures[0].id, updatedAt: new Date() } });
    await tx.special_sourcing.updateMany({ where: { pidSpecialSourcing: payment.serviceID!, pidUser: payment.pidUser, status: { in: ['pending', 'pending-payment', 'saved'] } }, data: { status: 'pending', xStatus: 'PAID', updatedAt: new Date() } });
  });
  await notifySpecialSourcingPayPal(payment.pidPayment);
  return { success: true };
}

async function notifySpecialSourcingPayPal(id: string) {
  const row = await prisma.payments.findUnique({ where: { pidPayment: id } });
  if (!row || row.paymentStatus !== 'PAID') return;
  for (const role of ['customer','admin']) {
    const sent = `$.${role}ReceiptSent`, lease = `$.${role}ReceiptLease`;
    const claimed = await prisma.$executeRaw`UPDATE payments SET paymentExt2 = JSON_SET(paymentExt2, ${lease}, UNIX_TIMESTAMP()) WHERE pidPayment = ${id} AND paymentStatus = 'PAID' AND COALESCE(JSON_EXTRACT(paymentExt2, ${sent}), false) = false AND COALESCE(JSON_EXTRACT(paymentExt2, ${lease}), 0) < UNIX_TIMESTAMP() - 300`;
    if (claimed !== 1) continue;
    try {
      const email = role === 'admin' ? 'hello@sureimports.com' : row.payerEmail;
      if (!email) throw Error('Receipt recipient missing');
      await xMail({ xEmail: email, xTitle: 'Sure Imports sourcing payment receipt', xBodyTitle: 'Payment received', xBody1: 'Your special sourcing research payment has been confirmed.', xBody2: '<p>Amount received: USD 20.00</p>', xButtonTitle: 'View dashboard', xButtonLink: role === 'admin' ? 'https://admin.sureimports.com/dashboard' : 'https://www.sureimports.com/dashboard/special-sourcing/pending' });
      await prisma.$executeRaw`UPDATE payments SET paymentExt2 = JSON_SET(paymentExt2, ${sent}, true) WHERE pidPayment = ${id}`;
    } catch {
      await prisma.$executeRaw`UPDATE payments SET paymentExt2 = JSON_SET(paymentExt2, ${lease}, 0) WHERE pidPayment = ${id}`;
    }
  }
}

export async function reconcileSpecialSourcingPayPal() {
  const environment = getSureImportsPayPalEnvironment();
  const rows = await prisma.$queryRaw<Array<{pidPayment:string;txRef:string;paymentStatus:string}>>`SELECT pidPayment, txRef, paymentStatus FROM payments WHERE pidPayment LIKE 'PPSRC_%' AND paymentStatus IN ('PENDING','PAID') AND txRef <> pidPayment AND JSON_UNQUOTE(JSON_EXTRACT(paymentExt2, '$.environment')) = ${environment} AND (paymentStatus = 'PENDING' OR COALESCE(JSON_EXTRACT(paymentExt2, '$.customerReceiptSent'), false) = false OR COALESCE(JSON_EXTRACT(paymentExt2, '$.adminReceiptSent'), false) = false) AND createdAt > DATE_SUB(NOW(), INTERVAL 30 DAY) ORDER BY updatedAt LIMIT 10`;
  const results = await Promise.allSettled(rows.map(async row => {
    await prisma.payments.update({where:{pidPayment:row.pidPayment},data:{updatedAt:new Date()}});
    return row.paymentStatus === 'PAID' ? notifySpecialSourcingPayPal(row.pidPayment) : confirmSpecialSourcingPayPal(row.txRef);
  }));
  return { checked: rows.length, recovered: results.filter(r=>r.status==='fulfilled').length };
}
