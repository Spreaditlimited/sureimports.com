// sendEmail.ts
import transporter from '@/lib/email/config/nodemailerConfig';
import mailTemplate from '@/lib/email/temp/mailTemplate2';

const { SMTP_EMAIL } = process.env;
const STANDARD_EMAIL_TEMPLATE_MARKER = 'sureimports-standard-email-template';

function ensureStandardTemplate(subject: string, html: string) {
  if (html?.includes(STANDARD_EMAIL_TEMPLATE_MARKER)) {
    return html;
  }

  return mailTemplate({
    zTitle: subject,
    zBodyTitle: subject,
    zBody1: html || '',
    zBody2: '',
    zButtonTitle: '',
    zButtonLink: '',
  }) as string;
}

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  retries = 3,
) => {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Sending email attempt ${attempt}/${retries} to: ${to}`);

      const info = await transporter.sendMail({
        from: `"Sure Imports" <${SMTP_EMAIL}>`,
        to,
        subject,
        html: ensureStandardTemplate(subject, html),
      });

      console.log('Email sent successfully:', info.messageId);
      return info; // Success - return immediately
    } catch (error: any) {
      lastError = error;
      console.error(
        `Email send attempt ${attempt}/${retries} failed:`,
        error.message,
      );

      // If this isn't the last attempt, wait before retrying
      if (attempt < retries) {
        const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retries failed
  console.error('All email send attempts failed:', lastError);
  throw lastError;
};

export default sendEmail;
