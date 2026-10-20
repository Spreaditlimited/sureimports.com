import { resolveNewProcurementShippingPricing } from '@/lib/procurement/shippingPricing';
import { NextRequest, NextResponse } from 'next/server';
import { sameOriginMutation } from '@/lib/refunds/request-auth';
import { prisma } from '@/lib/prisma';
import { requireProcurementUser } from '@/lib/procurement/assistance';

export async function GET(request: NextRequest) {
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  const order = await prisma.orders.findFirst({
    where: {
      pidOrder: request.nextUrl.searchParams.get('pidOrder') || '',
      pidUser: user.pidUser,
    },
    select: {
      destinationCountry: true,
      shippingPlan: true,
      shippingMeasurementUnit: true,
      orderName: true,
      shippingAddress: true,
      orderCategory: true,
      status: true,
      updatedAt: true,
      mergedIntoOrderId: true,
    },
  });
  if (!order)
    return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
  const country = order.destinationCountry
    ? await prisma.country.findUnique({
        where: { pidCountry: order.destinationCountry },
        select: {
          shippingPlans: {
            select: { pidShippingPlan: true, shippingPlanName: true },
          },
        },
      })
    : null;
  return NextResponse.json({
    ...order,
    shippingPlans: country?.shippingPlans || [],
  });
}

export async function PATCH(request: NextRequest) {
  if (!sameOriginMutation(request))
    return NextResponse.json(
      { message: 'Please submit from this website.' },
      { status: 403 },
    );
  const user = await requireProcurementUser();
  if (!user)
    return NextResponse.json({ message: 'Please sign in.' }, { status: 401 });
  const body = await request.json();
  if (
    typeof body.orderName !== 'string' ||
    !body.orderName.trim() ||
    body.orderName.length > 150 ||
    typeof body.shippingAddress !== 'string' ||
    body.shippingAddress.trim().length < 10 ||
    body.shippingAddress.length > 190 ||
    ![
      'Other Goods',
      'Goods with Battery',
      'Raw Batteries',
      'Liquids, Gases, Powder',
    ].includes(body.orderCategory)
  )
    return NextResponse.json(
      {
        message:
          'Enter an order name, complete delivery address (10–190 characters), and product category.',
      },
      { status: 400 },
    );
  if (
    typeof body.updatedAt !== 'string' ||
    !Number.isFinite(Date.parse(body.updatedAt))
  )
    return NextResponse.json(
      { message: 'Reload the order before editing.' },
      { status: 400 },
    );
  const existing = await prisma.orders.findFirst({
    where: {
      pidOrder: String(body.pidOrder),
      pidUser: user.pidUser,
      status: 'saved',
      mergedIntoOrderId: null,
    },
  });
  if (!existing)
    return NextResponse.json(
      { message: 'This order is no longer editable.' },
      { status: 409 },
    );
  const shippingPlan =
    typeof body.shippingPlan === 'string'
      ? body.shippingPlan
      : existing.shippingPlan;
  let pricing;
  try {
    pricing = await resolveNewProcurementShippingPricing(
      existing.destinationCountry || '',
      shippingPlan || '',
      body.orderCategory,
    );
    if (
      shippingPlan !== existing.shippingPlan &&
      pricing.measurementUnit !== (existing.shippingMeasurementUnit || 'KG')
    ) {
      return NextResponse.json(
        {
          message:
            'Changing between air and sea measurements requires a separate order with the correct product measurements.',
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Choose a valid shipping plan.',
      },
      { status: 400 },
    );
  }
  const result = await prisma.orders.updateMany({
    where: {
      pidOrder: String(body.pidOrder),
      pidUser: user.pidUser,
      status: 'saved',
      mergedIntoOrderId: null,
      updatedAt: new Date(body.updatedAt),
    },
    data: {
      orderName: body.orderName.trim(),
      shippingAddress: body.shippingAddress.trim(),
      orderCategory: body.orderCategory,
      ...(shippingPlan !== existing.shippingPlan
        ? {
            shippingPlan,
            shippingPricingVersion: existing.shippingPricingVersion,
            shippingMeasurementUnit: pricing.measurementUnit,
            shippingRateSnapshot: pricing.rate,
            shippingRateCurrency: pricing.rateCurrency,
          }
        : {}),
      updatedAt: new Date(),
      assistanceRevision: { increment: 1 },
    },
  });
  if (!result.count)
    return NextResponse.json(
      {
        message:
          'This order changed or is no longer editable. Reload before trying again.',
      },
      { status: 409 },
    );
  return NextResponse.json({ statusx: 'SUCCESS' });
}
