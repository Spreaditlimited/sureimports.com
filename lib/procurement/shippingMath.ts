export type ShippingMeasurementUnit = 'KG' | 'CBM';
export type ShippingRateCurrency = 'USD' | 'NGN';

export function finiteNumber(value: unknown, fallback = 0) {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const isNigeriaSeaShipping = (countryName: string, planName: string) =>
  countryName.trim().toLowerCase() === 'nigeria' &&
  planName.trim().toUpperCase() === 'SEA_SHIPPING';

export function measurementUnitForNewOrder(
  countryName: string,
  planName: string,
): ShippingMeasurementUnit {
  return isNigeriaSeaShipping(countryName, planName) ? 'CBM' : 'KG';
}

export function lineShippingMeasurement(
  quantity: number,
  perItemMeasurement: number,
) {
  return quantity * perItemMeasurement;
}

export function perItemMeasurementForOrder(
  pricingVersion: number | null | undefined,
  legacyWeight: number | null | undefined,
  newMeasurement: number | null | undefined,
) {
  return Number(pricingVersion) === 2
    ? Number(newMeasurement || 0)
    : Number(legacyWeight || 0);
}

export function shippingCostInUsd(
  measurement: number,
  rate: number,
  rateCurrency: string,
  ngnPerUsd: number,
) {
  const cost = measurement * rate;
  if (rateCurrency !== 'NGN') return cost;
  if (!Number.isFinite(ngnPerUsd) || ngnPerUsd <= 0) {
    throw new Error('NGN/USD rate is missing or invalid.');
  }
  return cost / ngnPerUsd;
}

export function procurementEstimateInUsd(
  productsTotalUsd: number,
  estimatedShippingCostUsd: number,
  serviceChargePercent: number,
  vatPercent: number,
) {
  const serviceChargeValueUsd = productsTotalUsd * (serviceChargePercent / 100);
  const vatValueUsd = serviceChargeValueUsd * (vatPercent / 100);
  return {
    serviceChargeValueUsd,
    vatValueUsd,
    grandTotalUsd:
      productsTotalUsd +
      estimatedShippingCostUsd +
      serviceChargeValueUsd +
      vatValueUsd,
  };
}

export function paymentDueInUsd(
  status: string,
  currentGrandTotalUsd: number,
  storedGrandTotalUsd: number,
  actualShippingCostUsd: number,
  storedShippingCostUsd: number,
) {
  if (status === 'saved') return Math.max(currentGrandTotalUsd, 0);
  if (status === 'on-hold') {
    return Math.max(currentGrandTotalUsd - storedGrandTotalUsd, 0);
  }
  if (status === 'pay-for-shipping') {
    return Math.max(actualShippingCostUsd - storedShippingCostUsd, 0);
  }
  return 0;
}

export function refundAmountInNgn(
  refundAmountUsd: number,
  ngnPerUsd: number,
  deductionPercent = 0,
) {
  if (!Number.isFinite(ngnPerUsd) || ngnPerUsd <= 0) {
    throw new Error('NGN/USD rate is missing or invalid.');
  }
  const deductionMultiplier = 1 - deductionPercent / 100;
  if (!Number.isFinite(deductionMultiplier) || deductionMultiplier < 0) {
    throw new Error('Refund deduction is invalid.');
  }
  return (
    Math.round(
      Math.max(refundAmountUsd, 0) * ngnPerUsd * deductionMultiplier * 100,
    ) / 100
  );
}
