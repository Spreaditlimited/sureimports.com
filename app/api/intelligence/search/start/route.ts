import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import { startUserSupplierResearch } from '@/lib/intelligence/researchRunner';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await checkAuth();
  if (!user?.pidUser) {
    return NextResponse.json({ message: 'Login required.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const pidSearch = String(body.pidSearch || '').trim();
  if (!pidSearch) {
    return NextResponse.json(
      { message: 'Search request id is required.' },
      { status: 400 },
    );
  }

  try {
    const result = await startUserSupplierResearch({
      pidSearch,
      pidUser: user.pidUser,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Could not start supplier research.' },
      { status: 500 },
    );
  }
}
