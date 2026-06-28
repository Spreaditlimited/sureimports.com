import nodemailer from 'nodemailer';
import mailTemplate from '@/lib/email/temp/mailTemplate2';

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.error({ error });
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: mailTemplate({
        zTitle: subject,
        zBodyTitle: subject,
        zBody1: body,
        zBody2: '',
        zButtonTitle: '',
        zButtonLink: '',
      }) as string,
    });
    console.log(sendResult);
  } catch (error) {
    console.log(error);
  }
}

export function compileWelcomeTemplate(name: string, url: string) {
  return mailTemplate({
    zTitle: 'Welcome to Sure Imports',
    zBodyTitle: `Welcome, ${name}`,
    zBody1: 'Your Sure Imports account is ready.',
    zBody2: '',
    zButtonTitle: 'Open Sure Imports',
    zButtonLink: url,
  }) as string;
}
