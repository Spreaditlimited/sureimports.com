import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticatePartnerApi } from '@/lib/affiliate/partnerApi';
import { measurementUnitForNewOrder } from '@/lib/procurement/shippingMath';

export async function GET(request: Request) {
  const auth = await authenticatePartnerApi(request, 'shipping:read');
  if (!auth.ok) return NextResponse.json({ code: auth.error, message: auth.error === 'SERVICE_UNAVAILABLE' ? 'The API is temporarily unavailable.' : 'This request requires an authorized API key.' }, { status: auth.error === 'UNAUTHORIZED' ? 401 : auth.error === 'INSUFFICIENT_SCOPE' ? 403 : 503 });
  try {
    const destination = (new URL(request.url).searchParams.get('destinationCountry') || '').trim();
    const countries = await prisma.country.findMany({
    where: destination ? { countryName: { equals: destination } } : undefined,
    select: { pidCountry: true, countryName: true, shippingPlans: { select: { pidShippingPlan: true, shippingPlanName: true, shippingPlanUnit: true } } },
    orderBy: { countryName: 'asc' },
  });
    return NextResponse.json({ data: countries.map((country) => ({ countryId: country.pidCountry, countryName: country.countryName, plans: country.shippingPlans.map((plan) => ({ shippingPlanId: plan.pidShippingPlan, name: plan.shippingPlanName, billingUnit: measurementUnitForNewOrder(country.countryName || '', plan.shippingPlanName || '') })) })) });
  } catch (error) {
    console.error('Partner shipping plans failed', error);
    return NextResponse.json({ code: 'SERVICE_UNAVAILABLE', message: 'The API is temporarily unavailable.' }, { status: 503 });
  }
}
