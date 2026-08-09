import { NextRequest } from 'next/server';

import { verifyEmailAccount } from '@/lib/auth/verifyEmailAccount';

export async function GET(request: NextRequest) {
  return verifyEmailAccount(request, '67699403ee348d7f8cb68f3a');
}
