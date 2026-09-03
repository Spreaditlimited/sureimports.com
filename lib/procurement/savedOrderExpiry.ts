export const SAVED_ORDER_LIFETIME_DAYS = 14;

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export type SavedOrderCountdown = {
  expiresAt: Date;
  text: string;
  tone: 'normal' | 'warning' | 'urgent';
};

export function getSavedOrderCountdown(
  createdAt: string | Date | null | undefined,
  now = Date.now(),
): SavedOrderCountdown | null {
  if (!createdAt) return null;

  const createdAtMs = new Date(createdAt).getTime();
  if (!Number.isFinite(createdAtMs)) return null;

  const expiresAtMs = createdAtMs + SAVED_ORDER_LIFETIME_DAYS * DAY_MS;
  const remainingMs = expiresAtMs - now;
  const expiresAt = new Date(expiresAtMs);

  if (remainingMs <= 0) {
    return {
      expiresAt,
      text: 'Expired — waiting to be removed',
      tone: 'urgent',
    };
  }

  if (remainingMs < HOUR_MS) {
    const minutes = Math.max(1, Math.ceil(remainingMs / MINUTE_MS));
    return {
      expiresAt,
      text: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} left to complete this order`,
      tone: 'urgent',
    };
  }

  if (remainingMs < DAY_MS) {
    const hours = Math.ceil(remainingMs / HOUR_MS);
    return {
      expiresAt,
      text: `${hours} ${hours === 1 ? 'hour' : 'hours'} left to complete this order`,
      tone: 'urgent',
    };
  }

  const days = Math.ceil(remainingMs / DAY_MS);
  return {
    expiresAt,
    text: `${days} ${days === 1 ? 'day' : 'days'} left to complete this order`,
    tone: days <= 4 ? 'warning' : 'normal',
  };
}
