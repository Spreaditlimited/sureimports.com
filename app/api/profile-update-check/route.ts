import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-user';

export async function GET(request: NextRequest) {
  const session = await currentUser();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const pidUser = request.nextUrl.searchParams.get('pidUser');
  if (pidUser !== session.pidUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (!pidUser) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const user = await prisma.users.findUnique({
    where: { pidUser },
    select: { phone: true, userPhone: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const phone = user.phone || user.userPhone || null;

  return NextResponse.json({ phone }, { headers: { 'Cache-Control': 'private, no-store' } });
}
