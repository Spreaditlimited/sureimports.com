// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';

const prisma = new PrismaClient();

async function ensureUsersBusinessNameColumn() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS businessName VARCHAR(191) NULL`,
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidUser: string }> },
) {
  try {
    await ensureUsersBusinessNameColumn();
    const { pidUser } = await params;
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

    return NextResponse.json({ ...user, businessName });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
