import { currentUser } from '@/lib/auth/current-user';
import { ShopError } from './policy';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createHash, timingSafeEqual } from 'node:crypto';

export function shopOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    throw new ShopError('Please reload the page and try again.', 403);
}

export function shopGuestHash(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token))
    throw new ShopError('Please reopen checkout and try again.', 403);
  return createHash('sha256').update(token).digest('hex');
}

export function hasShopGuestAccess(hash: string | null, token: string | null) {
  if (!hash || !token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const candidate = shopGuestHash(token);
  return (
    hash.length === candidate.length &&
    timingSafeEqual(Buffer.from(hash), Buffer.from(candidate))
  );
}

export async function shopUser(request: Request, mutation = false) {
  if (mutation && request.headers.get('origin') !== new URL(request.url).origin)
    throw new ShopError('Please reload the page and try again.', 403);
  const user = await currentUser();
  if (!user) throw new ShopError('Please sign in to continue.', 401);
  return user;
}

export function shopFailure(error: unknown, reference?: string) {
  if (error instanceof ShopError)
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: error.message,
        data: reference
          ? { ...(typeof error.data === 'object' ? error.data : {}), reference }
          : error.data,
      },
      { status: error.status },
    );
  if (error instanceof ZodError || error instanceof SyntaxError)
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message:
          'Check your cart, delivery address and payment details, then try again.',
      },
      { status: 400 },
    );
  console.error('Shop checkout error', error);
  return NextResponse.json(
    {
      statusx: 'FAILED',
      message:
        'We could not complete this check. Please retry the same payment attempt; do not start another payment if you have already been charged.',
      data: reference ? { reference } : undefined,
    },
    { status: 503 },
  );
}
