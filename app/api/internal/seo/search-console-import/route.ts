import jwt from 'jsonwebtoken';
import { after, NextRequest, NextResponse } from 'next/server';

import {
  executeSearchConsolePerformanceImport,
  startSearchConsolePerformanceImport,
} from '@/lib/search-console';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TOKEN_ISSUER = 'admin.sureimports.com';
const TOKEN_AUDIENCE = 'sureimports-gsc-manual-import';

function isAuthorized(request: NextRequest) {
  const secret = process.env.JWT_SECRET;
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!secret || !token) return false;

  try {
    const payload = jwt.verify(token, secret, {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    }) as jwt.JwtPayload;
    return payload.purpose === 'manual-gsc-import' && Boolean(payload.pidUser);
  } catch {
    return false;
  }
}

function validDate(value: unknown) {
  const date = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date
    ? null
    : date;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const startDate = validDate(body?.startDate);
  const endDate = validDate(body?.endDate);
  if (!startDate || !endDate || startDate > endDate) {
    return NextResponse.json(
      { ok: false, error: 'Choose a valid Search Console date range.' },
      { status: 400 },
    );
  }

  const latestAvailable = new Date();
  latestAvailable.setUTCDate(latestAvailable.getUTCDate() - 2);
  if (endDate > latestAvailable.toISOString().slice(0, 10)) {
    return NextResponse.json(
      { ok: false, error: 'Search Console data is imported only through two days ago.' },
      { status: 400 },
    );
  }

  try {
    const reservation = await startSearchConsolePerformanceImport({ startDate, endDate });
    if (!reservation.started) {
      return NextResponse.json(
        {
          ok: false,
          alreadyRunning: true,
          pidRun: reservation.run.pidRun,
          startDate: reservation.run.startDate,
          endDate: reservation.run.endDate,
          startedAt: reservation.run.startedAt,
          error: 'A Search Console import is already running.',
        },
        { status: 409 },
      );
    }

    after(async () => {
      try {
        await executeSearchConsolePerformanceImport(reservation.run);
      } catch (error) {
        console.error('Manual Search Console import failed', error);
      }
    });

    return NextResponse.json(
      {
        ok: true,
        pidRun: reservation.run.pidRun,
        startDate: reservation.run.startDate,
        endDate: reservation.run.endDate,
      },
      { status: 202 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Could not start the Search Console import.',
      },
      { status: 500 },
    );
  }
}
