import sendEmail from '@/lib/email/config/sendEmail';
import mailTemplate from '@/lib/email/temp/mailTemplate2';

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] || character,
  );
}

export async function sendMail({
  to,
  name,
  subject,
  body,
  bodyTitle,
  secondaryBody = '',
  buttonTitle = '',
  buttonLink = '',
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
  bodyTitle?: string;
  secondaryBody?: string;
  buttonTitle?: string;
  buttonLink?: string;
}) {
  const greeting = name ? `<p>Hello ${escapeHtml(name)},</p>` : '';
  const html = mailTemplate({
    zTitle: subject,
    zBodyTitle: bodyTitle || subject,
    zBody1: `${greeting}${body}`,
    zBody2: secondaryBody,
    zButtonTitle: buttonTitle,
    zButtonLink: buttonLink,
  }) as string;

  return sendEmail(to, subject, html);
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
