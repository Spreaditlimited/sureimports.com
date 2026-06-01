import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureUsersBusinessNameColumn() {
  await prisma.$executeRawUnsafe(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS businessName VARCHAR(191) NULL`,
  );
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const userData = verifyToken(token);
  if (!userData) {
    return NextResponse.json({ user: null });
  }

  const pidUser = String((userData as any)?.pidUser || '').trim();
  if (!pidUser) return NextResponse.json({ user: userData });

  await ensureUsersBusinessNameColumn();
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT businessName FROM users WHERE pidUser = ? LIMIT 1`,
    pidUser,
  )) as Array<{ businessName: string | null }>;
  const businessName = rows[0]?.businessName || null;

  return NextResponse.json({
    user: {
      ...(userData as any),
      businessName,
    },
  });
}
