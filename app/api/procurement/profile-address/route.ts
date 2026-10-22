import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await currentUser();
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await prisma.users.findUnique({
    where: { pidUser: session.pidUser },
    select: { address: true, country: true, phone: true, userPhone: true },
  });
  return NextResponse.json(
    {
      address: profile?.address?.trim() || '',
      country: profile?.country?.trim() || '',
      phone: profile?.phone?.trim() || profile?.userPhone?.trim() || '',
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
