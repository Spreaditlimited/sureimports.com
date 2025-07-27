import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/emailService';

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();
    await sendEmail({ to, subject, text, html });
    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 },
    );
  }
}
