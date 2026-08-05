import { NextResponse } from 'next/server';

import { downloadCloudinaryPdf } from '@/lib/cloudinary/download';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')?.trim() || '';
  if (!token)
    return NextResponse.json(
      { message: 'Download token is required.' },
      { status: 400 },
    );
  const order = await prisma.intelligence_report_orders.findUnique({
    where: { downloadToken: token },
  });
  if (!order || order.status !== 'paid')
    return NextResponse.json(
      { message: 'This download link is not valid.' },
      { status: 404 },
    );
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
