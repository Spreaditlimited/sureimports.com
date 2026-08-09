import { NextRequest } from 'next/server';

import { verifyEmailAccount } from '@/lib/auth/verifyEmailAccount';

export async function GET(request: NextRequest) {
  return verifyEmailAccount(request, '685ce6db61be37b2d27862a7');
}
