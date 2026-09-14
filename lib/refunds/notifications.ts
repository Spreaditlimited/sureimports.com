import 'server-only';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import transporter from '@/lib/email/config/nodemailerConfig';
import mailTemplate from '@/lib/email/temp/mailTemplate2';

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

/** The source rows are durable: this scan repairs any missed enqueue after a crash. */
export async function reconcileRefundNotifications(send = true) {
  await prisma.$executeRaw`INSERT IGNORE INTO refund_notifications (refundId,eventType) SELECT refundId,'REQUESTED' FROM refund_settlements WHERE status <> 'SETTLED'`;
  await prisma.$executeRaw`INSERT IGNORE INTO refund_notifications (refundId,eventType) SELECT refundId,'SETTLED' FROM refund_settlements WHERE status='SETTLED'`;
  if (!send) return { checked: 0, sent: 0 };
  const pending = await prisma.$queryRaw<{ refundId: string; eventType: string }[]>`SELECT refundId,eventType FROM refund_notifications WHERE status='PENDING' AND sentAt IS NULL AND nextAttemptAt <= NOW(3) AND (claimedAt IS NULL OR claimedAt < DATE_SUB(NOW(),INTERVAL 10 MINUTE)) ORDER BY nextAttemptAt LIMIT 5`;
  let sent = 0;
  for (const item of pending) {
    const claimed = await prisma.$executeRaw`UPDATE refund_notifications SET claimedAt=NOW(3),attempts=attempts+1 WHERE refundId=${item.refundId} AND eventType=${item.eventType} AND status='PENDING' AND sentAt IS NULL AND nextAttemptAt <= NOW(3) AND (claimedAt IS NULL OR claimedAt < DATE_SUB(NOW(),INTERVAL 10 MINUTE))`;
    if (!claimed) continue;
    try {
      const [settlement] = await prisma.$queryRaw<{ pidUser: string; settlementCurrency: string; settlementAmount: string; method: string; status: string }[]>`SELECT pidUser,settlementCurrency,settlementAmount,method,status FROM refund_settlements WHERE refundId=${item.refundId}`;
      if (!settlement || (item.eventType === 'SETTLED' && settlement.status !== 'SETTLED')) throw new Error('Settlement not confirmed.');
      if (item.eventType === 'REQUESTED' && settlement.status === 'SETTLED') {
        await prisma.$executeRaw`UPDATE refund_notifications SET status='SUPERSEDED',claimedAt=NULL WHERE refundId=${item.refundId} AND eventType=${item.eventType}`;
        continue;
      }
      const user = await prisma.users.findUnique({ where: { pidUser: settlement.pidUser }, select: { userEmail: true } });
      if (!user?.userEmail || !process.env.SMTP_EMAIL) throw new Error('Email destination unavailable.');
      const completed = item.eventType === 'SETTLED';
      const title = completed ? 'Your refund has been processed' : 'Your refund request has been received';
      const detail = completed ? settlement.method === 'WALLET' ? 'Your refund has been credited to your Sure Imports wallet.' : 'Your refund has been confirmed as processed. Your bank or payment provider may take additional time to make the funds available.' : 'Your refund request is awaiting processing. This message does not confirm a completed payment.';
      const html = mailTemplate({ zTitle: title, zBodyTitle: title, zBody1: `${detail}<br /><br />Refund reference: <b>${escape(item.refundId)}</b><br />Amount: <b>${escape(settlement.settlementCurrency)} ${escape(Number(settlement.settlementAmount).toFixed(2))}</b>`, zBody2: settlement.method === 'PAYPAL' ? 'The refund returns in the original payment currency. PayPal or your bank handles any currency conversion.' : '', zButtonTitle: 'View refund', zButtonLink: 'https://www.sureimports.com/dashboard/refunds' }) as string;
      const messageId = createHash('sha256').update(`${item.refundId}:${item.eventType}`).digest('hex');
      await transporter.sendMail({ from: `"Sure Imports" <${process.env.SMTP_EMAIL}>`, to: user.userEmail, subject: title, html, messageId: `<refund-${messageId}@sureimports.com>` });
      await prisma.$executeRaw`UPDATE refund_notifications SET status='SENT',sentAt=NOW(3),claimedAt=NULL WHERE refundId=${item.refundId} AND eventType=${item.eventType}`;
      sent++;
    } catch {
      await prisma.$executeRaw`UPDATE refund_notifications SET claimedAt=NULL,nextAttemptAt=DATE_ADD(NOW(),INTERVAL 1 HOUR) WHERE refundId=${item.refundId} AND eventType=${item.eventType}`;
    }
  }
  return { checked: pending.length, sent };
}
