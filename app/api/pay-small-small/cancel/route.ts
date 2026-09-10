import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { requireProcurementUser } from '@/lib/procurement/assistance';
import { voidAffiliateConversions } from '@/lib/affiliate/commissions';

export async function GET(request: NextRequest) {
  const pidPaySmallSmall = request.nextUrl.searchParams.get('pidPaySmallSmall');
  const user = await requireProcurementUser();
  if (!user || !pidPaySmallSmall) {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'Unauthorized',
      },
      { status: 401 },
    );
  }

  const updatex = await prisma.paysmallsmall.updateMany({
    where: {
      pidPaySmallSmall,
      pidUser: user.pidUser,
      status: { not: 'COMPLETED' },
    },
    data: { status: 'CANCELLED' },
  });

  if (updatex.count === 1) {
    await voidAffiliateConversions({
      externalOrderReference: `pay-small-small:${pidPaySmallSmall}`,
      reason: `Pay Small Small order ${pidPaySmallSmall} was cancelled by the customer.`,
      reversalReference: `customer-cancellation:${pidPaySmallSmall}`,
    });
    return NextResponse.json(
      {
        statusx: 'SUCCESS',
        message: 'PaySmallSmall Profile was Successfully Cancelled',
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        statusx: 'FAILED',
        message: 'PaySmallSmall Profile was NOT Cancelled',
      },
      { status: 409 },
    );
  }
}
