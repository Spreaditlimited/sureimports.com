import {
  goodsCategories,
  isShippingPlanAllowed,
  shippingEligibilityMessage,
} from './shippingEligibility';
import { getDeviceShippingSettings } from './deviceShippingSettings';
import { prisma } from '@/lib/prisma';
import {
  isNigeriaSeaShipping,
  type ShippingMeasurementUnit,
  type ShippingRateCurrency,
} from './shippingMath';

export type {
  ShippingMeasurementUnit,
  ShippingRateCurrency,
} from './shippingMath';

export const PROCUREMENT_SHIPPING_PRICING_VERSION = 2;

export type ProcurementShippingPricing = {
  devicePhoneRateNgn: number | null;
  deviceLaptopRateNgn: number | null;
  version: number;
  measurementUnit: ShippingMeasurementUnit;
  rate: number;
  rateCurrency: ShippingRateCurrency;
  countryName: string;
  planName: string;
};

function positiveNumber(value: unknown, label: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} is missing or invalid.`);
  }
  return parsed;
}

export async function resolveNewProcurementShippingPricing(
  destinationCountryId: string,
  shippingPlanId: string,
  orderCategory?: string,
): Promise<ProcurementShippingPricing> {
  if (
    orderCategory !== undefined &&
    !goodsCategories.some((category) => category === orderCategory)
  )
    throw new Error('Choose a valid goods category.');
  const country = await prisma.country.findUnique({
    where: { pidCountry: destinationCountryId },
    select: {
      countryName: true,
      shippingPlans: {
        where: { pidShippingPlan: shippingPlanId },
        select: {
          shippingPlanName: true,
          shippingPlanRate: true,
        },
        take: 1,
      },
    },
  });

  const plan = country?.shippingPlans[0];
  if (!country?.countryName || !plan?.shippingPlanName) {
    throw new Error(
      'The selected shipping plan is not available for this destination.',
    );
  }

  if (!isShippingPlanAllowed(orderCategory, plan.shippingPlanName))
    throw new Error(shippingEligibilityMessage);

  const deviceRates =
    country.countryName.trim().toLowerCase() === 'nigeria'
      ? await getDeviceShippingSettings()
      : null;
  const deviceSnapshot = {
    devicePhoneRateNgn: deviceRates?.phoneNgn ?? null,
    deviceLaptopRateNgn: deviceRates?.laptopNgn ?? null,
  };

  if (isNigeriaSeaShipping(country.countryName, plan.shippingPlanName)) {
    const financial = await prisma.exchange_rate.findUnique({
      where: { id: 1 },
      select: { quotationSeaRateNgnPerCbm: true },
    });

    return {
      ...deviceSnapshot,
      version: PROCUREMENT_SHIPPING_PRICING_VERSION,
      measurementUnit: 'CBM',
      rate: positiveNumber(
        financial?.quotationSeaRateNgnPerCbm,
        'Nigeria sea-shipping rate',
      ),
      rateCurrency: 'NGN',
      countryName: country.countryName,
      planName: plan.shippingPlanName,
    };
  }

  return {
    ...deviceSnapshot,
    version: PROCUREMENT_SHIPPING_PRICING_VERSION,
    measurementUnit: 'KG',
    rate: positiveNumber(plan.shippingPlanRate, 'Shipping-plan rate'),
    rateCurrency: 'USD',
    countryName: country.countryName,
    planName: plan.shippingPlanName,
  };
}
