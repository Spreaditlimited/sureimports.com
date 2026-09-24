import type { CustomerOrderInput } from './customer-order-policy';
import { calculatePartnerPricing } from './pricing';
import { procurementProductValue } from '../procurement/productPricing';
import { shippingCostInUsd } from '../procurement/shippingMath';

export type CostConfiguration = {
  ngnPerUsd: number;
  cnyPerUsd: number;
  ngnPerCny: number;
  productPricingVersion?: number;
  vatPercent: number;
  serviceChargeBps: number;
  partnerShareBps: number;
  minimumOrderNgn: number;
};
export type ShippingSnapshot = {
  version: number;
  measurementUnit: 'KG' | 'CBM';
  rate: number;
  rateCurrency: 'NGN' | 'USD';
  countryName: string;
  planName: string;
};
export function priceCustomerOrder(
  input: CustomerOrderInput,
  shipping: ShippingSnapshot,
  config: CostConfiguration,
) {
  if (
    ![config.ngnPerUsd, config.cnyPerUsd, shipping.rate].every(
      (v) => Number.isFinite(v) && v > 0,
    )
  )
    throw new Error('Invalid exchange or shipping rates.');
  if (
    !Number.isFinite(config.vatPercent) ||
    config.vatPercent < 0 ||
    config.vatPercent > 100 ||
    !Number.isFinite(config.minimumOrderNgn) ||
    config.minimumOrderNgn < 0
  )
    throw new Error('Invalid charge configuration.');
  const raw = input.products.reduce(
    (sum, p) => sum + p.productPrice * p.productQuantity,
    0,
  );
  // Match the existing create-order → add-product sequence. Empty drafts cannot pay.
  if (!input.products.length)
    return {
      currency: 'NGN' as const,
      productCostMinor: 0,
      shippingMinor: 0,
      taxMinor: 0,
      otherChargesMinor: 0,
      serviceChargeBps: config.serviceChargeBps,
      partnerShareBps: config.partnerShareBps,
      serviceChargeMinor: 0,
      partnerEarningsMinor: 0,
      sureImportsServiceMinor: 0,
      orderTotalMinor: 0,
      sureImportsAllocationMinor: 0,
      measurement: 0,
      config,
      shipping,
      meetsMinimum: false,
      minimumOrderNgn: config.minimumOrderNgn,
    };
  const productValue = procurementProductValue(
    raw,
    input.currencyType,
    shipping.countryName,
    config,
  );
  const measurement = input.products.reduce(
    (sum, p) => sum + p.shippingMeasurePerUnit * p.productQuantity,
    0,
  );
  // Mirrors the existing lifecycle: $5 estimated domestic freight plus plan-based international freight.
  const shippingUsd =
    5 +
    shippingCostInUsd(
      measurement,
      shipping.rate,
      shipping.rateCurrency,
      config.ngnPerUsd,
    );
  const minor = (usd: number) => Math.round(usd * config.ngnPerUsd * 100);
  const beforeTax = calculatePartnerPricing({
    currency: 'NGN',
    productCostMinor: Math.round(productValue.ngn * 100),
    shippingMinor: minor(shippingUsd),
    taxMinor: 0,
    otherChargesMinor: 0,
    serviceChargeBps: config.serviceChargeBps,
    partnerShareBps: config.partnerShareBps,
  });
  const taxMinor = Number(
    (BigInt(beforeTax.serviceChargeMinor) *
      BigInt(Math.round(config.vatPercent * 100)) +
      BigInt(5000)) /
      BigInt(10000),
  );
  const allocation = calculatePartnerPricing({ ...beforeTax, taxMinor });
  return {
    ...allocation,
    measurement,
    config,
    shipping,
    meetsMinimum:
      allocation.orderTotalMinor >= Math.round(config.minimumOrderNgn * 100),
    minimumOrderNgn: config.minimumOrderNgn,
  };
}
export type CustomerOrderCost = ReturnType<typeof priceCustomerOrder>;
export function checkoutTotal(
  cost: CustomerOrderCost,
  processingFeeMinor: number,
) {
  if (!Number.isSafeInteger(processingFeeMinor) || processingFeeMinor < 0)
    throw new Error('Invalid processing fee.');
  const total = cost.orderTotalMinor + processingFeeMinor;
  if (!Number.isSafeInteger(total))
    throw new Error('Order amount exceeds supported limit.');
  return total;
}
export function verifiedReceiptMatches(
  receipt: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    domain: string;
    orderId: string;
  },
  expected: {
    reference: string;
    amount: number;
    orderId: string;
    domain: string;
  },
) {
  return (
    receipt.status === 'success' &&
    receipt.reference === expected.reference &&
    receipt.currency === 'NGN' &&
    receipt.domain === expected.domain &&
    receipt.orderId === expected.orderId &&
    Number.isSafeInteger(receipt.amount) &&
    receipt.amount === expected.amount
  );
}
