import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const pidUser = request.nextUrl.searchParams.get('pidUser');

  const user = await prisma.users.findUnique({
    where: { pidUser: pidUser as string | undefined },
    select: { phone: true },
  });

  return NextResponse.json(user);
}
