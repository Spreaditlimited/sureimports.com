import { NextResponse } from 'next/server';
import { requireProcurementUser } from '@/lib/procurement/assistance';
import { createProcurementCheckout } from '@/lib/procurement/paystackCheckout';

export async function POST(request: Request) {
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json(
      { message: 'Please sign in again.' },
      { status: 401 },
    );
  try {
    const { pidOrder } = await request.json();
    if (typeof pidOrder !== 'string' || !pidOrder)
      return NextResponse.json(
        { message: 'Order is required.' },
        { status: 400 },
      );
    return NextResponse.json({
      ...(await createProcurementCheckout(pidOrder, user.pidUser)),
      email: user.userEmail,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to prepare checkout.',
      },
      { status: 409 },
    );
  }
}
