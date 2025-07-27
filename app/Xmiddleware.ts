import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token || !verifyToken(token)) {
    //return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
