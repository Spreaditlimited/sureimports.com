/** Paystack Nigeria local bank/USSD tariff, in kobo.
 * https://paystack.com/pricing — checked 12 September 2026.
 * Not applicable to international cards, DVA or alternative channel tariffs.
 */
export function customerProcessingFee(netMinor: number): number {
  if (
    !Number.isSafeInteger(netMinor) ||
    netMinor <= 0 ||
    netMinor > Number.MAX_SAFE_INTEGER - 200000
  )
    throw new Error('Invalid checkout amount.');
  const uncapped = Math.ceil(netMinor / 0.985);
  const gross =
    uncapped < 250000
      ? uncapped
      : Math.min(Math.ceil((netMinor + 10000) / 0.985), netMinor + 200000);
  return gross - netMinor;
}
