import { trackOpenAIRegistration } from './openaiEvents';
import { hasOptionalCookieConsent } from './optionalConsent';

// No account details are stored here: only event IDs and non-identifying event parameters.
type MetaEvent = {
  name: 'Lead' | 'CompleteRegistration';
  id: string;
  data: Record<string, string | number | boolean>;
  createdAt: number;
};
type PixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  __siPixelReady?: boolean;
};
const QUEUE = 'si:meta:pending:v1';
const SENT = 'si:meta:sent:v1';
let pending: MetaEvent[] = [];
const sent = new Set<string>();
const key = (event: MetaEvent) => `${event.name}:${event.id}`;
function read<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(sessionStorage.getItem(name) || 'null') || fallback;
  } catch {
    return fallback;
  }
}
function save(name: string, value: unknown) {
  try {
    sessionStorage.setItem(name, JSON.stringify(value));
  } catch {
    /* Memory queue still works. */
  }
}
export function flushFacebookEvents() {
  if (typeof window === 'undefined') return;
  const pixel = window as unknown as PixelWindow;
  if (!hasOptionalCookieConsent()) {
    pending = [];
    save(QUEUE, []);
    return;
  }
  const remembered = read<string[]>(SENT, []);
  if (Array.isArray(remembered)) remembered.forEach((id) => sent.add(id));
  const stored = read<MetaEvent[]>(QUEUE, []);
  const all = [...(Array.isArray(stored) ? stored : []), ...pending];
  pending = [
    ...new Map(
      all
        .filter(
          (e) =>
            e &&
            ['Lead', 'CompleteRegistration'].includes(e.name) &&
            typeof e.id === 'string' &&
            Date.now() - e.createdAt < 86400000 &&
            !sent.has(key(e)),
        )
        .map((e) => [key(e), e]),
    ).values(),
  ].slice(-50);
  if (pixel.__siPixelReady && typeof pixel.fbq === 'function') {
    pending = pending.filter((event) => {
      try {
        pixel.fbq!('track', event.name, event.data, { eventID: event.id });
        sent.add(key(event));
        return false;
      } catch {
        return true;
      }
    });
  }
  save(QUEUE, pending);
  save(SENT, [...sent].slice(-200));
}
export function queueFacebookEvent(event: Omit<MetaEvent, 'createdAt'>) {
  if (typeof window === 'undefined' || !event.id) return;
  pending.push({ ...event, createdAt: Date.now() });
  flushFacebookEvents();
}
export function trackRegistrationConversion(
  conversion?: { eventId: string; method: string } | null,
) {
  if (!conversion) return;
  trackOpenAIRegistration(conversion.eventId);
  queueFacebookEvent({
    name: 'CompleteRegistration',
    id: conversion.eventId,
    data: {
      content_name: 'Sure Imports account',
      status: true,
      registration_method: conversion.method,
    },
  });
}
