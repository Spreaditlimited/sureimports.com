import { NextRequest } from 'next/server';

import { verifyEmailAccount } from '@/lib/auth/verifyEmailAccount';

export async function GET(request: NextRequest) {
  return verifyEmailAccount(request, '684961e564601c6b1e717092');
}
