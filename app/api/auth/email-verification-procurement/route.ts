import { NextRequest } from 'next/server';

import { verifyEmailAccount } from '@/lib/auth/verifyEmailAccount';

export async function GET(request: NextRequest) {
  return verifyEmailAccount(request, '685ce6ea886960703b6ff33f');
}
