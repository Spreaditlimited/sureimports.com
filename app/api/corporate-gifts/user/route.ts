import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token) as { pidUser?: string } | null;
    if (!payload?.pidUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { pidUser: payload.pidUser },
      select: {
        pidUser: true,
        userEmail: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const emailSet = [user.userEmail, user.email]
      .filter((x): x is string => Boolean(x))
      .map((x) => x.trim().toLowerCase());

    const emailConditions =
      emailSet.length > 0
        ? Prisma.sql` OR ${Prisma.join(
            emailSet.map((email) => Prisma.sql`LOWER(contactEmail) = ${email}`),
            ' OR ',
          )}`
        : Prisma.empty;

    const requests = await prisma.$queryRaw<
      Array<Record<string, any>>
    >(Prisma.sql`
      SELECT *
      FROM corporate_gift_request
      WHERE pidUser = ${user.pidUser}
      ${emailConditions}
      ORDER BY updatedAt DESC
    `);

    return NextResponse.json({
      statusx: 'SUCCESS',
      data: requests,
    });
  } catch (error) {
    console.error('Failed to fetch user corporate gift requests:', error);
    return NextResponse.json(
      { statusx: 'ERROR', message: 'Failed to fetch requests' },
      { status: 500 },
    );
  }
}
