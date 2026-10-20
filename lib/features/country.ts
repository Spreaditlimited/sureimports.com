import countries from '@/lib/data/countries';
// Profile country is residence, not an order's destination. Never infer it from IP or phone.
export function normalizeAccountCountry(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const input = value.trim().toLowerCase();
  const aliases: Record<string, string> = { ng: 'Nigeria', nga: 'Nigeria', uk: 'United Kingdom', gb: 'United Kingdom', gbr: 'United Kingdom', us: 'United States', usa: 'United States' };
  return aliases[input] || countries.find(c => c.optionValue && c.optionValue.toLowerCase() === input)?.optionValue || null;
}
