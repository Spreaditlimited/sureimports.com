import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const deletedProduct = await prisma.special_sourcing.deleteMany({
    where: {
      status: 'pending',
    },
  });

  return NextResponse.json({ ok: true });
}
