export function isNigeriaDestination(destination: string) {
  return ['nigeria', 'ng', 'nga'].includes(destination.trim().toLowerCase());
}

export function destinationVatPercent(
  destination: string,
  nigeriaRate: unknown,
  foreignRate: unknown,
) {
  if (!destination.trim())
    throw new Error('A destination is required to calculate VAT.');
  const local = isNigeriaDestination(destination);
  const configured = local ? nigeriaRate : foreignRate;
  const value =
    configured === null || configured === undefined || configured === ''
      ? local
        ? 7.5
        : 20
      : Number(configured);
  if (!Number.isFinite(value) || value < 0 || value > 100)
    throw new Error('The configured VAT rate is invalid.');
  return value;
}

export function bankMatchesDestination(
  bank: { country?: string | null; currency?: string | null },
  destination: string,
) {
  if (!destination.trim()) return false;
  if (isNigeriaDestination(destination))
    return (
      isNigeriaDestination(bank.country || '') &&
      bank.currency?.toUpperCase() === 'NGN'
    );
  return ['united kingdom', 'uk', 'gb', 'gbr', 'great britain'].includes(
    (bank.country || '').trim().toLowerCase(),
  );
}
