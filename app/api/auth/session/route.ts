import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const userData = verifyToken(token);
  if (!userData) {
    return NextResponse.json({ user: null });
  }
  console.log('---------------- RUNNING SESSION --------------------');
  return NextResponse.json({ user: userData });
}
