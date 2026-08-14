// 14 August 2026, midnight in Europe/London (BST).
// Keep the fallback fixed: using `new Date()` would move the boundary on every deploy.
export const SES_MARKETING_CUTOVER_AT = new Date(
  process.env.SES_MARKETING_CUTOVER_AT || '2026-08-13T23:00:00.000Z',
);

export function belongsToSesMarketing(value: Date | string | null | undefined) {
  if (!value || Number.isNaN(SES_MARKETING_CUTOVER_AT.getTime())) return false;
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) && date >= SES_MARKETING_CUTOVER_AT;
}
