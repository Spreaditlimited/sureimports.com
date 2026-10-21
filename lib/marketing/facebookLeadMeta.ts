import { queueFacebookEvent } from './facebookEvents';
export type FacebookLeadMeta = {
  fbEventId: string;
  fbp: string | null;
  fbc: string | null;
  pageUrl: string | null;
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length < 2) return null;
  return parts.pop()?.split(';').shift() || null;
}

function getFbcFromFbclid(): string | null {
  if (typeof window === 'undefined') return null;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  try {
    const saved = JSON.parse(
      sessionStorage.getItem('si:meta:attribution') || 'null',
    );
    if (
      !fbclid ||
      (saved?.clickId === fbclid && Date.now() - saved.createdAt < 86400000)
    )
      return saved && Date.now() - saved.createdAt < 86400000
        ? saved.fbc
        : null;
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    sessionStorage.setItem(
      'si:meta:attribution',
      JSON.stringify({ clickId: fbclid, fbc, createdAt: Date.now() }),
    );
    return fbc;
  } catch {
    return fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
  }
}

function generateEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function buildFacebookLeadMeta(): FacebookLeadMeta {
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc') || getFbcFromFbclid();

  return {
    fbEventId: generateEventId(),
    fbp,
    fbc,
    pageUrl: typeof window !== 'undefined' ? window.location.href : null,
  };
}

type BrowserLeadEventInput = {
  eventId: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentCategory?: string;
  numItems?: number;
};

export function trackBrowserLeadEvent(input: BrowserLeadEventInput) {
  if (typeof window === 'undefined') return;

  const payload: Record<string, string | number> = {};
  if (typeof input.value === 'number' && Number.isFinite(input.value)) {
    payload.value = input.value;
  }
  if (input.currency) payload.currency = input.currency;
  if (input.contentName) payload.content_name = input.contentName;
  if (input.contentCategory) payload.content_category = input.contentCategory;
  if (typeof input.numItems === 'number') payload.num_items = input.numItems;

  queueFacebookEvent({ name: 'Lead', id: input.eventId, data: payload });
}

export function captureFacebookAttribution() {
  getFbcFromFbclid();
}
