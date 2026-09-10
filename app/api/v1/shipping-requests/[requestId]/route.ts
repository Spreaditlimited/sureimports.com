import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticatePartnerApi } from '@/lib/affiliate/partnerApi';

export async function GET(request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const auth = await authenticatePartnerApi(request, 'shipping:read');
  if (!auth.ok) return NextResponse.json({ code: auth.error, message: auth.error === 'SERVICE_UNAVAILABLE' ? 'The API is temporarily unavailable.' : 'This request requires an authorized API key.' }, { status: auth.error === 'UNAUTHORIZED' ? 401 : auth.error === 'INSUFFICIENT_SCOPE' ? 403 : 503 });
  try {
    const { requestId } = await params;
    const record = await prisma.shipping_request_attributions.findFirst({ where: { pidShippingOnly: requestId, affiliateId: auth.credential.affiliateId }, include: { shippingRequest: { select: { pidShippingOnly: true, status: true, shippingName: true, shippingTo: true, shippingPlan: true, grossWeight: true, trackingNumber: true, createdAt: true, updatedAt: true } } } });
    if (!record) return NextResponse.json({ code: 'NOT_FOUND', message: 'Shipping request was not found.' }, { status: 404 });
    return NextResponse.json({ requestId: record.pidShippingOnly, status: record.shippingRequest.status, shipment: record.shippingRequest, ownership: { attributionId: record.pidAttribution, lockedAt: record.lockedAt, source: record.sourceType } });
  } catch (error) {
    console.error('Partner shipping request lookup failed', error);
    return NextResponse.json({ code: 'SERVICE_UNAVAILABLE', message: 'The API is temporarily unavailable.' }, { status: 503 });
  }
}
