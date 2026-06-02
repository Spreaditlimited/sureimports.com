import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEFAULT_LOGIN_REDIRECT = '/dashboard/procurement';

function getSafeLoginRedirect(redirectCandidate: string | null): string {
  if (!redirectCandidate) return DEFAULT_LOGIN_REDIRECT;

  try {
    const url = new URL(redirectCandidate, 'https://sureimports.local');
    const isSameOrigin = url.origin === 'https://sureimports.local';
    const isDashboardPath = url.pathname.startsWith('/dashboard');
    const isShopCheckoutResume =
      url.pathname === '/shop/checkout' &&
      url.searchParams.get('resumeCheckout') === '1';

    if (isSameOrigin && (isDashboardPath || isShopCheckoutResume)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return DEFAULT_LOGIN_REDIRECT;
  }

  return DEFAULT_LOGIN_REDIRECT;
}

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
    const safeNextPath = getSafeLoginRedirect(nextParam);
    return NextResponse.redirect(new URL(safeNextPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/login'],
};
