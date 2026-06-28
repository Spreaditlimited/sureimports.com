import nodemailer from 'nodemailer';
import mailTemplate from '@/lib/email/temp/mailTemplate2';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'hello@sureimports.com',
    pass: 'nofzu2-purquj-hevseQ',
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const body = html || text || '';
  const wrappedHtml = mailTemplate({
    zTitle: subject,
    zBodyTitle: subject,
    zBody1: body,
    zBody2: '',
    zButtonTitle: '',
    zButtonLink: '',
  }) as string;

  const mailOptions = {
    from: 'hello@sureimports.com',
    to,
    subject,
    text: text || '',
    html: wrappedHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
