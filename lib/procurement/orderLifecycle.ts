import { prisma } from '@/lib/prisma';
import {
  perItemMeasurementForOrder,
  paymentDueInUsd,
  procurementEstimateInUsd,
  shippingCostInUsd,
} from './shippingMath';

const EDITABLE_ESTIMATE_STATUSES = new Set(['saved', 'on-hold']);

const money = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

function finite(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getProcurementOrderLifecycle(
  pidOrder: string,
  pidUser?: string,
) {
  const order = await prisma.orders.findFirst({
    where: { pidOrder, ...(pidUser ? { pidUser } : {}) },
  });
  if (!order) throw new Error('Order not found.');

  const [products, country, plan, financial] = await Promise.all([
    prisma.products.findMany({
      where: { pidOrder },
      orderBy: { id: 'asc' },
    }),
    order.destinationCountry
      ? prisma.country.findUnique({
          where: { pidCountry: order.destinationCountry },
          select: { countryName: true },
        })
      : null,
    order.shippingPlan
      ? prisma.shippingplan.findUnique({
          where: { pidShippingPlan: order.shippingPlan },
          select: {
            shippingPlanName: true,
            shippingPlanRate: true,
            shippingPlanUnit: true,
          },
        })
      : null,
    prisma.exchange_rate.findUnique({ where: { id: 1 } }),
  ]);

  if (!financial) throw new Error('Financial configuration was not found.');

  const usesMeasurementPricing = order.shippingPricingVersion === 2;
  const useLatestEstimate = EDITABLE_ESTIMATE_STATUSES.has(order.status || '');
  const ngnPerUsd = useLatestEstimate
    ? finite(financial.exNairaToDollar)
    : finite(order.exchangeRate1, finite(financial.exNairaToDollar));
  const cnyPerUsd = useLatestEstimate
    ? finite(financial.exYuanToDollar)
    : finite(order.exchangeRate2, finite(financial.exYuanToDollar));
  if (ngnPerUsd <= 0 || cnyPerUsd <= 0) {
    throw new Error('Exchange-rate configuration is invalid.');
  }

  const productsTotalRaw = products.reduce(
    (total, product) =>
      total + finite(product.productQuantity) * finite(product.productPrice),
    0,
  );
  const productsTotalUsd =
    order.currencyType === 'CNY'
      ? productsTotalRaw / cnyPerUsd
      : order.currencyType === 'NGN'
        ? productsTotalRaw / ngnPerUsd
        : productsTotalRaw;
  const totalMeasurement = products.reduce(
    (total, product) =>
      total +
      finite(product.productQuantity) *
        perItemMeasurementForOrder(
          order.shippingPricingVersion,
          product.productWeight,
          product.shippingMeasurePerUnit,
        ),
    0,
  );

  const shippingRate = usesMeasurementPricing
    ? finite(order.shippingRateSnapshot)
    : finite(plan?.shippingPlanRate, 10);
  const shippingUnit = usesMeasurementPricing
    ? order.shippingMeasurementUnit === 'CBM'
      ? 'CBM'
      : 'KG'
    : plan?.shippingPlanUnit === 'CBM'
      ? 'CBM'
      : 'KG';
  const shippingRateCurrency = usesMeasurementPricing
    ? order.shippingRateCurrency === 'NGN'
      ? 'NGN'
      : 'USD'
    : 'USD';

  const domesticShippingCostUsd = 5;
  const internationalShippingCostUsd = shippingCostInUsd(
    totalMeasurement,
    shippingRate,
    shippingRateCurrency,
    ngnPerUsd,
  );
  const dynamicEstimatedShippingCostUsd =
    domesticShippingCostUsd + internationalShippingCostUsd;
  const serviceChargePercent = useLatestEstimate
    ? finite(financial.service_charge, 15)
    : finite(order.serviceCharge, finite(financial.service_charge, 15));
  const vatPercent = useLatestEstimate
    ? finite(financial.vat, 7)
    : finite(order.vat, finite(financial.vat, 7));
  const {
    serviceChargeValueUsd,
    vatValueUsd,
    grandTotalUsd: dynamicGrandTotalUsd,
  } = procurementEstimateInUsd(
    productsTotalUsd,
    dynamicEstimatedShippingCostUsd,
    serviceChargePercent,
    vatPercent,
  );

  const estimatedShippingCostUsd = useLatestEstimate
    ? dynamicEstimatedShippingCostUsd
    : finite(order.orderShippingCost, dynamicEstimatedShippingCostUsd);
  const grandTotalUsd = useLatestEstimate
    ? dynamicGrandTotalUsd
    : finite(order.orderTotalCost, dynamicGrandTotalUsd);

  const actualMeasurement = finite(order.orderWeight);
  const actualDomesticShippingCostUsd = finite(order.shippingCost1) / cnyPerUsd;
  const actualInternationalShippingCostUsd = shippingCostInUsd(
    actualMeasurement,
    shippingRate,
    shippingRateCurrency,
    ngnPerUsd,
  );
  const actualTotalShippingCostUsd =
    actualDomesticShippingCostUsd + actualInternationalShippingCostUsd;

  const status = order.status || '';
  let nextPaidStatus = '';
  if (status === 'saved') {
    nextPaidStatus = 'pending';
  } else if (status === 'on-hold') {
    nextPaidStatus = 'pending';
  } else if (status === 'pay-for-shipping') {
    nextPaidStatus = 'in-transit';
  }
  const paymentDueUsd = paymentDueInUsd(
    status,
    dynamicGrandTotalUsd,
    finite(order.orderTotalCost),
    actualTotalShippingCostUsd,
    finite(order.orderShippingCost),
  );

  const destinationCountry = country?.countryName || '';
  const paymentCurrency =
    destinationCountry.trim().toLowerCase() === 'nigeria' ? 'NGN' : 'USD';
  const paymentDue = money(
    paymentCurrency === 'NGN' ? paymentDueUsd * ngnPerUsd : paymentDueUsd,
  );

  return {
    order,
    products,
    destinationCountry,
    shippingPlanName: plan?.shippingPlanName || '',
    usesMeasurementPricing,
    shippingRate,
    shippingUnit,
    shippingRateCurrency,
    productsTotalUsd,
    productsCount: products.length,
    totalMeasurement,
    domesticShippingCostUsd,
    internationalShippingCostUsd,
    dynamicEstimatedShippingCostUsd,
    estimatedShippingCostUsd,
    serviceChargePercent,
    serviceChargeValueUsd,
    vatPercent,
    vatValueUsd,
    dynamicGrandTotalUsd,
    grandTotalUsd,
    actualMeasurement,
    actualDomesticShippingCostUsd,
    actualInternationalShippingCostUsd,
    actualTotalShippingCostUsd,
    costDifferenceUsd: actualTotalShippingCostUsd - estimatedShippingCostUsd,
    onHoldDifferenceUsd: dynamicGrandTotalUsd - finite(order.orderTotalCost),
    rates: {
      ngnPerUsd,
      cnyPerUsd,
      ngnPerCny: finite(financial.exNairaToYuan),
    },
    payment: {
      dueUsd: money(paymentDueUsd),
      due: paymentDue,
      currency: paymentCurrency,
      nextStatus: nextPaidStatus,
      isPayable: paymentDue > 0 && Boolean(nextPaidStatus),
    },
    snapshot: {
      orderTotalCost: String(dynamicGrandTotalUsd),
      orderWeight: String(totalMeasurement),
      orderShippingCost: String(dynamicEstimatedShippingCostUsd),
      vat: String(financial.vat ?? vatPercent),
      serviceCharge: String(financial.service_charge ?? serviceChargePercent),
      exchangeRate1: String(financial.exNairaToDollar ?? ngnPerUsd),
      exchangeRate2: String(financial.exYuanToDollar ?? cnyPerUsd),
      exchangeRate3: String(financial.exNairaToYuan ?? 0),
    },
  };
}
