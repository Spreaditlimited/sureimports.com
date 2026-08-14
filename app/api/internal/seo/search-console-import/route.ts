import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { after, NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  executeSearchConsolePerformanceImport,
  startSearchConsolePerformanceImport,
} from '@/lib/search-console';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type DispatchTokenRow = {
  id: number;
  pidUser: string;
  startDate: Date;
  endDate: Date;
  userStatus: string | null;
};

async function consumeAuthorizedDispatchToken(
  request: NextRequest,
  startDate: string,
  endDate: string,
) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) return false;
  const tokenHash = createHash('sha256').update(token).digest('hex');

  return prisma.$transaction(async (transaction) => {
    const rows = await transaction.$queryRaw<DispatchTokenRow[]>(
      Prisma.sql`
        SELECT t.id, t.pidUser, t.startDate, t.endDate, a.userStatus
        FROM seo_manual_gsc_dispatch_tokens t
        INNER JOIN admin a ON a.pidUser = t.pidUser
        WHERE t.tokenHash = ${tokenHash}
          AND t.status = 'pending'
          AND t.expiresAt > ${new Date()}
        LIMIT 1
        FOR UPDATE
      `,
    );
    const dispatch = rows[0];
    const authorizedStatus = dispatch?.userStatus === 'superadmin' || dispatch?.userStatus === 'L1';
    const matchingRange =
      dispatch?.startDate.toISOString().slice(0, 10) === startDate &&
      dispatch?.endDate.toISOString().slice(0, 10) === endDate;
    if (!dispatch || !authorizedStatus || !matchingRange) return false;

    await transaction.$executeRaw(
      Prisma.sql`
        UPDATE seo_manual_gsc_dispatch_tokens
        SET status = 'consumed', consumedAt = ${new Date()}, updatedAt = ${new Date()}
        WHERE id = ${dispatch.id}
          AND status = 'pending'
      `,
    );
    return true;
  });
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

  if (!(await consumeAuthorizedDispatchToken(request, startDate, endDate))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
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
