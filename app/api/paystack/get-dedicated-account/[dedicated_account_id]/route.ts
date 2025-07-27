import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { dedicated_account_id: string } },
) {
  const { dedicated_account_id } = params;

  try {
    const response = await fetch(
      `https://api.paystack.co/dedicated_account/${dedicated_account_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dedicated account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dedicated account' },
      { status: 500 },
    );
  }
}
