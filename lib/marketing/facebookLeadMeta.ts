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
  if (!fbclid) return null;
  const timestamp = Date.now();
  return `fb.1.${timestamp}.${fbclid}`;
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
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== 'function') return;

  const payload: Record<string, string | number> = {};
  if (typeof input.value === 'number' && Number.isFinite(input.value)) {
    payload.value = input.value;
  }
  if (input.currency) payload.currency = input.currency;
  if (input.contentName) payload.content_name = input.contentName;
  if (input.contentCategory) payload.content_category = input.contentCategory;
  if (typeof input.numItems === 'number') payload.num_items = input.numItems;

  fbq('track', 'Lead', payload, { eventID: input.eventId });
}
