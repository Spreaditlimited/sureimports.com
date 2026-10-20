import { prisma } from '@/lib/prisma';
import transporter from '@/lib/email/config/nodemailerConfig';
import { deliverSupportNotifications } from '@/lib/support/notifications';
export const maxDuration = 120;
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`
  )
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (
    process.env.SUPPORT_CHAT_ENABLED !== 'true' ||
    process.env.SUPPORT_NOTIFICATIONS_ENABLED !== 'true'
  )
    return Response.json({ disabled: true });
  const result = await deliverSupportNotifications(
    prisma,
    async (notice) => {
      await transporter.sendMail({
        from: `"Sure Imports Support" <${process.env.SMTP_EMAIL}>`,
        to: notice.to,
        subject: notice.subject,
        messageId: notice.messageId,
        text: `${notice.subject}.\n\nOpen your conversation: ${notice.url}\n\nPlease reply in the support conversation. This email contains no order or message details.`,
      });
    },
    process.env.SUPPORT_TEAM_EMAIL || 'hello@sureimports.com',
  );
  return Response.json(result);
}
