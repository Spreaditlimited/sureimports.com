import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';
import { checkoutOriginIsAllowed } from '@/lib/intelligence/reportCheckoutSecurity';
import {
  SUPPLIER_PAYMENT_PURPOSES,
  createSupplierVerificationEvent,
} from '@/lib/supplierVerification/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  context: { params: Promise<{ requestId: string }> },
) {
  if (!checkoutOriginIsAllowed(request)) {
    return NextResponse.json(
      { message: 'This request is not allowed.' },
      { status: 403 },
    );
  }
  const auth = await checkAuth();
  if (!auth)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { requestId } = await context.params;
  const item = await prisma.verify_supplier.findUnique({
    where: { pidVerifySupplier: requestId },
    include: {
      payments: {
        where: { status: 'paid' },
        select: { paymentPurpose: true },
      },
    },
  });
  if (!item || item.pidUser !== auth.pidUser) {
    return NextResponse.json(
      { message: 'Verification request was not found.' },
      { status: 404 },
    );
  }
  const basePaid = item.payments.some(
    (payment) =>
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.VERIFICATION ||
      payment.paymentPurpose === SUPPLIER_PAYMENT_PURPOSES.LEGACY_COMBINED,
  );
  if (
    item.verificationType !== 'PHYSICAL' ||
    !basePaid ||
    item.transportQuoteStatus !== 'READY'
  ) {
    return NextResponse.json(
      { message: 'There is no physical-visit quote available to decline.' },
      { status: 409 },
    );
  }
  await prisma.verify_supplier.update({
    where: { pidVerifySupplier: requestId },
    data: {
      transportQuoteStatus: 'DECLINED',
      customerMessage:
        'You declined the optional physical visit. We will continue with online verification only.',
      updatedAt: new Date(),
    },
  });
  await createSupplierVerificationEvent({
    requestId,
    eventType: 'PHYSICAL_VISIT_DECLINED',
    fromStatus: item.status,
    toStatus: item.status,
    message:
      'Physical visit declined. Your standard online verification will continue.',
    actorId: auth.pidUser,
    actorEmail: auth.userEmail,
  });
  return NextResponse.json({ success: true });
}
