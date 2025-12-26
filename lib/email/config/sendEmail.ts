// sendEmail.ts
import transporter from '@/lib/email/config/nodemailerConfig';

const { SMTP_EMAIL } = process.env;

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
        html,
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
