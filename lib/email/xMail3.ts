'use server';
import sendEmail from '@/lib/email/config/sendEmail';
import mailTemplate from '@/lib/email/temp/mailTemplate2';
import { cleanLegacyEmailBody } from '@/lib/email/cleanBody';

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
  let zBody1: any = cleanLegacyEmailBody(xBody);

  const mail = mailTemplate({
    zTitle,
    zBodyTitle,
    zBody1,
    zBody2: '',
    zButtonTitle: '',
    zButtonLink: '',
  }) as any;

  try {
    await sendEmail(xEmail, xTitle, mail);
  } catch (error) {
    console.error('myThrowingFunction failed', error);
  }
}
