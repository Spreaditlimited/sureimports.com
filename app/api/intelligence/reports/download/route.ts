import { NextResponse } from 'next/server';

import { downloadCloudinaryPdf } from '@/lib/cloudinary/download';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';
import { reportDownloadRequiresAccount } from '@/lib/intelligence/reportOrderPolicy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')?.trim() || '';
  const pidOrder = new URL(request.url).searchParams.get('order')?.trim() || '';
  if (!token && !pidOrder)
    return NextResponse.json(
      { message: 'Download access is required.' },
      { status: 400 },
    );
  const order = token
    ? await prisma.intelligence_report_orders.findUnique({
        where: { downloadToken: token },
      })
    : await prisma.intelligence_report_orders.findUnique({
        where: { pidOrder },
      });
  if (!order || order.status !== 'paid')
    return NextResponse.json(
      { message: 'This download link is not valid.' },
      { status: 404 },
    );
  const requiresAccountAuthorization = reportDownloadRequiresAccount({
    hasToken: Boolean(token),
    expiresAt: order.downloadTokenExpiresAt,
  });
  if (requiresAccountAuthorization) {
    const user = await checkAuth();
    if (!user?.pidUser || user.pidUser !== order.pidUser) {
      return NextResponse.json(
        {
          message: token
            ? 'This email download link has expired. Sign in to My Supplier Reports to continue.'
            : 'You are not authorized to download this report.',
        },
        { status: token ? 410 : 403 },
      );
    }
  }
  const [report, version] = await Promise.all([
    prisma.intelligence_report_products.findUnique({
      where: { pidReport: order.reportId },
    }),
    prisma.intelligence_report_versions.findUnique({
      where: { pidVersion: order.versionId },
    }),
  ]);
  if (!report || !version?.pdfPublicId)
    return NextResponse.json(
      { message: 'The purchased edition is unavailable.' },
      { status: 404 },
    );

  let file: Buffer;
  try {
    file = await downloadCloudinaryPdf(version.pdfPublicId);
  } catch {
    return NextResponse.json(
      { message: 'Unable to retrieve the report file.' },
      { status: 502 },
    );
  }
  await prisma.intelligence_report_orders.update({
    where: { pidOrder: order.pidOrder },
    data: { downloadCount: { increment: 1 }, updatedAt: new Date() },
  });
  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.slug}-${version.editionLabel.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
