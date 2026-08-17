import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [countries, financial] = await Promise.all([
      prisma.country.findMany({
        select: {
          pidCountry: true,
          countryName: true,
          shippingPlans: {
            select: {
              pidShippingPlan: true,
              shippingPlanName: true,
              shippingPlanRate: true,
              shippingPlanUnit: true,
            },
          },
        },
      }),
      prisma.exchange_rate.findUnique({
        where: { id: 1 },
        select: { quotationSeaRateNgnPerCbm: true },
      }),
    ]);

    const nigeriaSeaRate = Number(financial?.quotationSeaRateNgnPerCbm);
    const response = countries.map((country) => ({
      ...country,
      shippingPlans: country.shippingPlans.map((plan) => {
        const isNigeriaSea =
          country.countryName?.trim().toLowerCase() === 'nigeria' &&
          plan.shippingPlanName?.trim().toUpperCase() === 'SEA_SHIPPING';
        return {
          ...plan,
          shippingPlanRate:
            isNigeriaSea && Number.isFinite(nigeriaSeaRate)
              ? nigeriaSeaRate
              : plan.shippingPlanRate,
          shippingPlanUnit: isNigeriaSea ? 'CBM' : 'KG',
          shippingPlanCurrency: isNigeriaSea ? 'NGN' : 'USD',
        };
      }),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Error fetching countries' },
      { status: 500 },
    );
  }
}
