import { prisma } from '@/lib/prisma';
import {
  finiteNumber,
  perItemMeasurementForOrder,
  paymentDueInUsd,
  procurementEstimateInUsd,
  shippingCostInUsd,
} from './shippingMath';
import { normalizeProcurementMinimumOrderNgn } from './minimumOrder';

const EDITABLE_ESTIMATE_STATUSES = new Set(['saved', 'on-hold']);

const money = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

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
    ? finiteNumber(financial.exNairaToDollar)
    : finiteNumber(
        order.exchangeRate1,
        finiteNumber(financial.exNairaToDollar),
      );
  const cnyPerUsd = useLatestEstimate
    ? finiteNumber(financial.exYuanToDollar)
    : finiteNumber(order.exchangeRate2, finiteNumber(financial.exYuanToDollar));
  if (ngnPerUsd <= 0 || cnyPerUsd <= 0) {
    throw new Error('Exchange-rate configuration is invalid.');
  }

  const productsTotalRaw = products.reduce(
    (total, product) =>
      total +
      finiteNumber(product.productQuantity) *
        finiteNumber(product.productPrice),
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
      finiteNumber(product.productQuantity) *
        perItemMeasurementForOrder(
          order.shippingPricingVersion,
          product.productWeight,
          product.shippingMeasurePerUnit,
        ),
    0,
  );

  const shippingRate = usesMeasurementPricing
    ? finiteNumber(order.shippingRateSnapshot)
    : finiteNumber(plan?.shippingPlanRate, 10);
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
    ? finiteNumber(financial.service_charge, 15)
    : finiteNumber(
        order.serviceCharge,
        finiteNumber(financial.service_charge, 15),
      );
  const vatPercent = useLatestEstimate
    ? finiteNumber(financial.vat, 7)
    : finiteNumber(order.vat, finiteNumber(financial.vat, 7));
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
    : finiteNumber(order.orderShippingCost, dynamicEstimatedShippingCostUsd);
  const grandTotalUsd = useLatestEstimate
    ? dynamicGrandTotalUsd
    : finiteNumber(order.orderTotalCost, dynamicGrandTotalUsd);

  const actualMeasurement = finiteNumber(order.orderWeight);
  const actualDomesticShippingCostUsd =
    finiteNumber(order.shippingCost1) / cnyPerUsd;
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
    finiteNumber(order.orderTotalCost),
    actualTotalShippingCostUsd,
    finiteNumber(order.orderShippingCost),
  );

  const destinationCountry = country?.countryName || '';
  const paymentCurrency =
    destinationCountry.trim().toLowerCase() === 'nigeria' ? 'NGN' : 'USD';
  const paymentDue = money(
    paymentCurrency === 'NGN' ? paymentDueUsd * ngnPerUsd : paymentDueUsd,
  );
  const minimumOrderNgn = normalizeProcurementMinimumOrderNgn(
    financial.procurementMinimumOrderNgn,
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
    onHoldDifferenceUsd:
      dynamicGrandTotalUsd - finiteNumber(order.orderTotalCost),
    rates: {
      ngnPerUsd,
      cnyPerUsd,
      ngnPerCny: finiteNumber(financial.exNairaToYuan),
    },
    payment: {
      dueUsd: money(paymentDueUsd),
      due: paymentDue,
      currency: paymentCurrency,
      nextStatus: nextPaidStatus,
      isPayable: paymentDue > 0 && Boolean(nextPaidStatus),
      minimumOrderNgn,
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
