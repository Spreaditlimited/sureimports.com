import mailTemplate from '@/lib/email/temp/mailTemplate2';
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
        replyTo: process.env.SUPPORT_REPLY_EMAIL || process.env.SUPPORT_TEAM_EMAIL || 'hello@sureimports.com',
        subject: notice.subject,
        messageId: notice.messageId,
        html: mailTemplate({ zTitle: notice.subject, zBodyTitle: notice.subject, zLabel: 'SUPPORT UPDATE', zBody1: 'There is an update in your support conversation. Open the conversation to read it and reply, or reply to this email to reach our team.', zBody2: 'For your privacy, this email contains no order or message details.', zButtonTitle: 'Open conversation', zButtonLink: notice.url }),
        text: `${notice.subject}.\n\nOpen your conversation: ${notice.url}\n\nYou can also reply to this email to reach our team. This email contains no order or message details.`,
      });
    },
    process.env.SUPPORT_TEAM_EMAIL || 'hello@sureimports.com',
  );
  return Response.json(result);
}
