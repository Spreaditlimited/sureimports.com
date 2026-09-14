import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function refundUser() {
  const token = (await cookies()).get('token')?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return null;
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    return typeof payload !== 'string' && typeof payload.pidUser === 'string'
      ? payload.pidUser
      : null;
  } catch {
    return null;
  }
}

export function sameOriginMutation(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origin = request.headers.get('origin');
  return !!origin && origin === new URL(request.url).origin;
}
