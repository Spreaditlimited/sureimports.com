import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getUserSupplierResearchStatus } from '@/lib/intelligence/researchRunner';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await checkAuth();
  if (!user?.pidUser) {
    return NextResponse.json({ message: 'Login required.' }, { status: 401 });
  }

  const pidSearch = request.nextUrl.searchParams.get('pidSearch')?.trim();
  if (!pidSearch) {
    return NextResponse.json(
      { message: 'Search request id is required.' },
      { status: 400 },
    );
  }

  const result = await getUserSupplierResearchStatus({
    pidSearch,
    pidUser: user.pidUser,
  });

  if (!result) {
    return NextResponse.json(
      { message: 'Search request was not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, data: result });
}
