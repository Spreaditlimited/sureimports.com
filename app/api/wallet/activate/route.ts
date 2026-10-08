import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';
import { ensurePaystackWalletAccount } from '@/lib/wallet/paystackProvisioning';

export async function POST() {
  try {
    const session = await currentUser();
    if (!session) {
      return NextResponse.json(
        { message: 'Please sign in to activate your wallet.' },
        { status: 401 },
      );
    }
    const user = await prisma.users.findUnique({
      where: { pidUser: session.pidUser },
      select: {
        userEmail: true,
        userFirstname: true,
        userLastname: true,
        phone: true,
        userPhone: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    const result = await ensurePaystackWalletAccount(user);
    return NextResponse.json(result, {
      status:
        result.status === 'READY'
          ? 200
          : result.status === 'PROFILE_REQUIRED'
            ? 422
            : 502,
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch {
    return NextResponse.json(
      {
        status: 'FAILED',
        message:
          'Wallet activation is temporarily unavailable. Please try again.',
      },
      { status: 503 },
    );
  }
}
