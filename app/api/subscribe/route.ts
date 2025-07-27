// app/api/subscribe/route.ts

import { NextResponse } from 'next/server';

interface SubscriberData {
  email: string;
  first_name?: string;
  last_name?: string;
  segment_ids?: string[];
}

export async function POST(request: Request) {
  try {
    const body: SubscriberData = await request.json();
    const { email, first_name, last_name, segment_ids } = body;

    const response = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
        'User-Agent': 'Sure Imports (www.sureimports.com)',
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        segment_ids,
      }),
    });

    console.log('response', response);

    if (!response.ok) {
      throw new Error('Failed to add subscriber to Flodesk');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error adding subscriber' },
      { status: 500 },
    );
  }
}
