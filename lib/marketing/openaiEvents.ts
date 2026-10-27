// Public pixel ID; no API credential or customer contact information is used.
export const OPENAI_PIXEL_ID = 'EQMUckBR96itM6rKeWCjUD';
type Queue = ((...args: unknown[]) => void) & { q?: unknown[][] };
type AdsWindow = Window & { oaiq?: Queue; __siOpenAIInitialized?: boolean };
const sent = new Set<string>();
const SENT_KEY = 'si:openai:registrations:v1';

export function hasOpenAIConsent() {
  return (
    typeof document !== 'undefined' &&
    document.cookie.split(';').some((value) => value.trim() === 'consent=true')
  );
}

export function syncOpenAIConsent() {
  if (typeof window === 'undefined') return;
  const target = window as AdsWindow;
  const consent = hasOpenAIConsent();
  if (!consent) {
    target.oaiq?.('consent', false);
    return;
  }
  if (!target.oaiq) {
    const queue: Queue = (...args: unknown[]) => {
      queue.q!.push(args);
    };
    queue.q = [];
    target.oaiq = queue;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
    document.head.appendChild(script);
  }
  target.oaiq('consent', true);
  if (!target.__siOpenAIInitialized) {
    target.oaiq('init', { pixelId: OPENAI_PIXEL_ID });
    target.__siOpenAIInitialized = true;
  }
}

// Called from the server-confirmed new-account response, never from a page view.
export function trackOpenAIRegistration(eventId: string) {
  if (!eventId || !hasOpenAIConsent()) return;
  syncOpenAIConsent();
  const target = window as AdsWindow;
  if (!target.oaiq) return;
  try {
    const stored: unknown = JSON.parse(
      sessionStorage.getItem(SENT_KEY) || '[]',
    );
    if (Array.isArray(stored))
      stored.forEach((id) => {
        if (typeof id === 'string') sent.add(id);
      });
  } catch {
    /* Memory deduplication still applies. */
  }
  if (sent.has(eventId)) return;
  target.oaiq(
    'measure',
    'registration_completed',
    { type: 'customer_action' },
    {
      event_id: eventId,
      opt_out: true,
    },
  );
  sent.add(eventId);
  try {
    sessionStorage.setItem(SENT_KEY, JSON.stringify([...sent].slice(-200)));
  } catch {
    /* Storage can be disabled by the browser. */
  }
}
