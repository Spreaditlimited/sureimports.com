export function assertPayPalLiveFulfillment(order: any) {
  if (order?.sureImportsEnvironment === 'sandbox') {
    throw new Error(
      'Sandbox payment confirmed. No live order, earnings or payment ledger has been changed.',
    );
  }
}

export function assertPayPalOrderMatches(
  order: any,
  expected: { customId: string; amountMinor: number; currency: string },
) {
  const units = order?.purchase_units;
  const unit = units?.[0];
  if (
    !Array.isArray(units) ||
    units.length !== 1 ||
    unit?.custom_id !== expected.customId ||
    String(unit?.amount?.currency_code).toUpperCase() !==
      expected.currency.toUpperCase() ||
    !Number.isSafeInteger(expected.amountMinor) ||
    expected.amountMinor <= 0 ||
    Math.round(Number(unit?.amount?.value) * 100) !== expected.amountMinor
  ) {
    throw new Error(
      'PayPal order does not match the expected payment. No capture was attempted.',
    );
  }
}
