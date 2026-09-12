// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';
import { currentUser } from '@/lib/auth/current-user';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidUser: string }> },
) {
  try {
    const session = await currentUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { pidUser } = await params;
    if (pidUser !== session.pidUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const user = await prisma.users.findUnique({
      where: {
        pidUser: pidUser,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const rows = (await prisma.$queryRawUnsafe(
      `SELECT businessName FROM users WHERE pidUser = ? LIMIT 1`,
      pidUser,
    )) as Array<{ businessName: string | null }>;
    const businessName = rows[0]?.businessName || null;

    const { userPassword, userSession, loginKey, loginStamp, ...profile } = user;
    return NextResponse.json({ ...profile, businessName }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
