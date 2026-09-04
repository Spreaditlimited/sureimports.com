export const DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN = 50_000;

export function normalizeProcurementMinimumOrderNgn(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0
    ? Math.round(amount)
    : DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN;
}

export function formatNairaAmount(value: number) {
  return `₦${normalizeProcurementMinimumOrderNgn(value).toLocaleString('en-NG')}`;
}

export function procurementMinimumOrderMessage(value: number) {
  return `We cannot process Nigeria-bound procurement orders below ${formatNairaAmount(value)}. Please edit your order before paying.`;
}
