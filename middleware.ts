import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = Boolean(token);

  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set(
      'message',
      'Your session has expired. Please log in again.',
    );
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (
    (pathname === '/auth/login' || pathname === '/login') &&
    isAuthenticated
  ) {
    const nextParam = request.nextUrl.searchParams.get('next');
    const safeNextPath =
      nextParam && nextParam.startsWith('/') && !nextParam.startsWith('/auth/')
        ? nextParam
        : '/dashboard/procurement';
    return NextResponse.redirect(new URL(safeNextPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/login'],
};
