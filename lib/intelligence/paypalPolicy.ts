export function paypalUsdMinor(value: unknown): number {
  if (typeof value !== 'string' || !/^\d+(\.\d{1,2})?$/.test(value))
    throw Error('Invalid PayPal amount.');
  const minor = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(minor) || minor <= 0)
    throw Error('Invalid PayPal amount.');
  return minor;
}
export function paidMonthEnd(paidAt: Date) {
  if (!Number.isFinite(paidAt.getTime())) throw Error('Invalid payment date.');
  const next = new Date(paidAt);
  const day = next.getUTCDate();
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + 1);
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0),
  ).getUTCDate();
  next.setUTCDate(Math.min(day, lastDay));
  return next;
}
export function validatePaypalSubscriptionPayment(input: {
  actualAmount: unknown;
  currency: unknown;
  expectedMinor: number;
  status: unknown;
}) {
  if (
    String(input.status).toUpperCase() !== 'COMPLETED' ||
    input.currency !== 'USD' ||
    paypalUsdMinor(input.actualAmount) !== input.expectedMinor
  )
    throw Error('PayPal payment does not match this checkout.');
}
