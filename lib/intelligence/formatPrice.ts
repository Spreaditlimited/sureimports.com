export function formatIntelligencePrice(
  amount: number,
  currency: 'NGN' | 'USD',
) {
  return amount > 0
    ? new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
        style: 'currency',
        currency,
        currencyDisplay: currency === 'USD' ? 'code' : 'symbol',
        maximumFractionDigits: currency === 'NGN' ? 0 : 2,
      }).format(amount)
    : 'Pricing coming soon';
}
