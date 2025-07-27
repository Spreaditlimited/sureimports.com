'use server';
import sendEmail from '@/lib/email/config/sendEmail';
import mailTemplate from '@/lib/email/temp/mailTemplate3';

interface Props {
  xEmail: any;
  xTitle: any;
  xBodyTitle?: any;
  xBody?: any;
}

//EMAIL PROCESSOR
export default async function xMail({
  xEmail,
  xTitle,
  xBodyTitle,
  xBody,
}: Props) {
  let zTitle: string = xTitle;
  let zBodyTitle: any = xBodyTitle;
  let zBody: any = xBody;

  const mail = mailTemplate({
    zTitle,
    zBodyTitle,
    zBody,
  }) as any;

  try {
    await sendEmail(xEmail, xTitle, mail);
  } catch (error) {
    console.error('myThrowingFunction failed', error);
  }
}
