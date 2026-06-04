import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');

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

  // Older form-created accounts stored the signup number only in userPhone.
  if (!user.phone && user.userPhone) {
    await prisma.users.update({
      where: { pidUser },
      data: { phone: user.userPhone },
    });
  }

  return NextResponse.json({ phone });
}
