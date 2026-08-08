import { NextRequest, NextResponse } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';

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

  return NextResponse.json(
    {
      message:
        'This supplier search must be approved by Sure Imports before external research can begin.',
      pidSearch,
    },
    { status: 409 },
  );
}
