export function normalizeNigerianPhone(value: unknown): string | null {
  const digits = String(value || '').replace(/\D/g, '');

  let subscriberNumber = digits;
  if (digits.startsWith('234')) {
    subscriberNumber = digits.slice(3);
  } else if (digits.startsWith('0')) {
    subscriberNumber = digits.slice(1);
  }

  if (!/^[789]\d{9}$/.test(subscriberNumber)) {
    return null;
  }

  return `+234${subscriberNumber}`;
}
