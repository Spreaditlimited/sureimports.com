import { hasOptionalCookieConsent } from './optionalConsent';

const CONVERSION_DESTINATION = 'AW-998486805/Zvv2CKrqkbEdEJXmjtwD';
const PENDING_KEY = 'si:google-ads:signup:pending:v1';
const SENT_KEY = 'si:google-ads:signup:sent:v1';

function readIds(key: string): string[] {
  try {
    const ids: unknown = JSON.parse(sessionStorage.getItem(key) || '[]');
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveIds(key: string, ids: string[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(ids.slice(-50)));
  } catch {
    // A blocked storage write must not interrupt registration.
  }
}

export function flushGoogleSignupConversions() {
  if (typeof window === 'undefined' || !hasOptionalCookieConsent()) return;
  const target = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  target.dataLayer ||= [];
  target.gtag ||= function () {
    target.dataLayer!.push(arguments);
  };
  const sent = new Set(readIds(SENT_KEY));
  const pending = readIds(PENDING_KEY);
  for (const eventId of pending) {
    if (sent.has(eventId)) continue;
    target.gtag('event', 'conversion', {
      send_to: CONVERSION_DESTINATION,
      transaction_id: eventId,
    });
    sent.add(eventId);
  }
  saveIds(SENT_KEY, [...sent]);
  saveIds(PENDING_KEY, []);
}

export function trackGoogleSignupConversion(eventId: string) {
  if (typeof window === 'undefined' || !eventId) return;
  const sent = new Set(readIds(SENT_KEY));
  if (sent.has(eventId)) return;
  const pending = new Set(readIds(PENDING_KEY));
  pending.add(eventId);
  saveIds(PENDING_KEY, [...pending]);
  flushGoogleSignupConversions();
}
