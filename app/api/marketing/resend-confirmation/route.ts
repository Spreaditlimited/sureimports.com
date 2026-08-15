import { NextResponse } from 'next/server';

import {
  MARKETING_EMAIL_PATTERN,
  resendMarketingOptInConfirmation,
} from '@/lib/marketing/contactLedger';

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { message: 'This request could not be accepted.' },
      { status: 403 },
    );
  }

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!MARKETING_EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { message: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  try {
    const result = await resendMarketingOptInConfirmation(email);

    if (result === 'TOO_SOON') {
      return NextResponse.json(
        {
          message:
            'A confirmation email was sent recently. Please wait a minute before trying again.',
        },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }

    return NextResponse.json({
      message:
        'If this address still needs confirmation, a fresh link is on its way. Please check your inbox and spam folder.',
    });
  } catch (error) {
    console.error('Marketing confirmation resend failed', error);
    return NextResponse.json(
      {
        message:
          'We could not send the confirmation email right now. Please try again shortly.',
      },
      { status: 500 },
    );
  }
}
