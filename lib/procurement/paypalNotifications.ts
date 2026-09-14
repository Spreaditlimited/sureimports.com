import { prisma } from '@/lib/prisma';
import xMail from '@/lib/email/xMail';

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!,
  );

// Persist delivery markers separately for customer/admin. A five-minute lease
// prevents concurrent callbacks from sending the same notice. SMTP is at-least-once:
// a crash after sending but before marking SENT may cause a repeat, never a lost receipt.
export async function notifyProcurementPayPalPayment(id: string) {
  const [payment] = await prisma.$queryRaw<
    Array<{
      id: string;
      pidOrder: string;
      pidUser: string;
      status: string;
      amountMinor: number;
    }>
  >`
    SELECT id, pidOrder, pidUser, status, amountMinor FROM paypal_procurement_checkouts
    WHERE id = ${id} AND status IN ('PAID', 'REVIEW')
  `;
  if (!payment) return;
  const user = await prisma.users.findUnique({
    where: { pidUser: payment.pidUser },
    select: { userEmail: true },
  });
  for (const role of ['customer', 'admin'] as const) {
    const sentPath = `$.${role}ReceiptSent`;
    const leasePath = `$.${role}ReceiptLease`;
    const claim = await prisma.$executeRaw`
      UPDATE paypal_procurement_checkouts SET context = JSON_SET(context, ${leasePath}, UNIX_TIMESTAMP())
      WHERE id = ${id} AND status IN ('PAID', 'REVIEW')
      AND COALESCE(JSON_EXTRACT(context, ${sentPath}), false) = false
      AND COALESCE(JSON_EXTRACT(context, ${leasePath}), 0) < UNIX_TIMESTAMP() - 300
    `;
    if (claim !== 1) continue;
    try {
      const email =
        role === 'admin' ? 'hello@sureimports.com' : user?.userEmail;
      if (!email) throw new Error('Receipt recipient is missing.');
      const review = payment.status === 'REVIEW';
      await xMail({
        xEmail: email,
        xTitle: review
          ? 'Procurement payment received — review required'
          : 'Sure Imports procurement payment receipt',
        xBodyTitle: 'Payment received',
        xBody1: review
          ? 'Payment has been received, but the order changed during checkout. Our team needs to review it. Please do not pay again.'
          : 'Your procurement payment has been confirmed and the order has been updated.',
        xBody2: `<p>Order: <strong>${escape(payment.pidOrder)}</strong></p><p>Amount received: <strong>USD ${(payment.amountMinor / 100).toFixed(2)}</strong></p><p>Payment reference: ${escape(id)}</p>`,
        xButtonTitle:
          role === 'admin' ? 'Open admin dashboard' : 'View your orders',
        xButtonLink:
          role === 'admin'
            ? 'https://admin.sureimports.com/dashboard'
            : 'https://www.sureimports.com/dashboard/procurement/view-orders/pending',
      });
      await prisma.$executeRaw`UPDATE paypal_procurement_checkouts SET context = JSON_SET(context, ${sentPath}, true) WHERE id = ${id}`;
    } catch {
      // Keep the pending marker for the scheduled reconciler; email failure must
      // never tell a paid customer that the payment itself failed.
      await prisma.$executeRaw`UPDATE paypal_procurement_checkouts SET context = JSON_SET(context, ${leasePath}, 0) WHERE id = ${id}`;
      console.error('Procurement PayPal receipt delivery deferred', {
        id,
        role,
      });
    }
  }
}
