import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const NIGERIA_STAGES = [
  { key: 'request-received', label: 'Request Received' },
  { key: 'product-shipped', label: 'Shipped' },
  { key: 'product-arrived', label: 'Arrived' },
  { key: 'invoiced', label: 'Invoiced' },
  { key: 'paid', label: 'Paid' },
  { key: 'product-delivered', label: 'Completed' },
] as const;

const LEGACY_STATUSES: Record<string, string> = {
  saved: 'request-received',
  'request received': 'request-received',
  pending: 'product-shipped',
  approved: 'product-shipped',
  shipped: 'product-shipped',
  'product shipped': 'product-shipped',
  'pay-for-shipping': 'product-arrived',
  arrived: 'product-arrived',
  'product arrived': 'product-arrived',
  'in-transit': 'product-delivered',
  completed: 'product-delivered',
  'ready-for-pickup': 'product-delivered',
  cancelled: 'request-cancelled',
  'request cancelled': 'request-cancelled',
};

function normalizeStatus(value: unknown) {
  const normalized = String(value || '').trim().toLowerCase();
  return LEGACY_STATUSES[normalized] || normalized;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ trackingId: string }> },
) {
  const { trackingId } = await params;
  const id = decodeURIComponent(trackingId).trim();
  if (!id || id.length > 100) {
    return NextResponse.json(
      { statusx: 'ERROR', message: 'Enter a valid tracking ID' },
      { status: 400 },
    );
  }

  const shipment = await prisma.shipping_only.findUnique({
    where: { pidShippingOnly: id },
    select: {
      pidShippingOnly: true,
      shippingName: true,
      shippingTo: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!shipment) {
    return NextResponse.json(
      {
        statusx: 'NOT_FOUND',
        message: 'No shipment was found for that tracking ID',
      },
      { status: 404 },
    );
  }

  const destination = await prisma.country.findFirst({
    where: {
      OR: [
        { pidCountry: shipment.shippingTo || '' },
        { countrySlug: shipment.shippingTo || '' },
        { countryName: shipment.shippingTo || '' },
      ],
    },
    select: { countryName: true },
  });
  const destinationCountry =
    destination?.countryName || shipment.shippingTo || '';

  if (destinationCountry.trim().toLowerCase() !== 'nigeria') {
    return NextResponse.json(
      {
        statusx: 'NOT_FOUND',
        message: 'Public tracking is currently available for China to Nigeria shipments only',
      },
      { status: 404 },
    );
  }

  const currentStatus = normalizeStatus(shipment.status);
  const cancelled = currentStatus === 'request-cancelled';
  const currentIndex = NIGERIA_STAGES.findIndex(
    (stage) => stage.key === currentStatus,
  );
  const stages = NIGERIA_STAGES.map((stage, index) => ({
    ...stage,
    state: cancelled
      ? 'upcoming'
      : index < currentIndex
        ? 'completed'
        : index === currentIndex
          ? 'current'
          : 'upcoming',
  }));
  const currentStatusLabel = cancelled
    ? 'Request Cancelled'
    : NIGERIA_STAGES[currentIndex]?.label || 'Processing';

  return NextResponse.json({
    statusx: 'SUCCESS',
    data: {
      pidShippingOnly: shipment.pidShippingOnly,
      shippingName: shipment.shippingName,
      originCountry: 'China',
      destinationCountry,
      currentStatus,
      currentStatusLabel,
      cancelled,
      stages,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    },
  });
}
