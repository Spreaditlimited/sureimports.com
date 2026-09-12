/** NGN minor units (kobo). Never use floating-point naira for allocations. */
export type PartnerPricingInput = {
  currency: 'NGN';
  productCostMinor: number;
  shippingMinor: number;
  taxMinor: number;
  otherChargesMinor: number;
  serviceChargeBps: number;
  partnerShareBps: number;
};

function minor(value: number, name: string) {
  if (!Number.isSafeInteger(value) || value < 0)
    throw new Error(`${name} must be a non-negative safe integer.`);
  return BigInt(value);
}

function safe(value: bigint) {
  if (value > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error('Amount exceeds the supported limit.');
  return Number(value);
}

export function calculatePartnerPricing(input: PartnerPricingInput) {
  if (input.currency !== 'NGN') throw new Error('Only NGN is supported.');
  for (const rate of [input.serviceChargeBps, input.partnerShareBps]) {
    if (!Number.isInteger(rate) || rate < 0 || rate > 10_000)
      throw new Error('Rates must be whole basis points between 0 and 10000.');
  }
  if (input.partnerShareBps > input.serviceChargeBps)
    throw new Error('Partner share cannot exceed the service charge.');
  const product = minor(input.productCostMinor, 'Product cost');
  if (product === BigInt(0)) throw new Error('Product cost must be positive.');
  const shipping = minor(input.shippingMinor, 'Shipping');
  const tax = minor(input.taxMinor, 'Tax');
  const other = minor(input.otherChargesMinor, 'Other charges');
  // Round half up once for each charge; retain remainder in the SI share.
  const service =
    (product * BigInt(input.serviceChargeBps) + BigInt(5000)) / BigInt(10000);
  const partner =
    (product * BigInt(input.partnerShareBps) + BigInt(5000)) / BigInt(10000);
  const total = product + service + shipping + tax + other;
  return {
    ...input,
    serviceChargeMinor: safe(service),
    partnerEarningsMinor: safe(partner),
    sureImportsServiceMinor: safe(service - partner),
    orderTotalMinor: safe(total),
    sureImportsAllocationMinor: safe(total - partner),
  };
}

/** Pure planning only: this does not initiate payment or authorise settlement. */
export function planPartnerCollection(
  pricing: ReturnType<typeof calculatePartnerPricing>,
  processingFeeMinor: number,
) {
  // Recompute rather than trusting supplied derived fields.
  const checked = calculatePartnerPricing(pricing);
  const fee = minor(processingFeeMinor, 'Processing fee');
  return {
    currency: 'NGN' as const,
    customerTotalMinor: safe(BigInt(checked.orderTotalMinor) + fee),
    processingFeeMinor,
    partnerAllocationMinor: checked.partnerEarningsMinor,
    sureImportsAllocationMinor: checked.sureImportsAllocationMinor,
  };
}
