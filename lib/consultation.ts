import crypto from 'crypto';

export const CONSULTATION_TIMEZONE = 'Africa/Lagos';
export const CONSULTATION_DURATION_MINUTES = 30;

let zoomTokenCache = {
  token: '',
  expiresAtMs: 0,
};

export function clean(value: unknown, max = 400) {
  return String(value || '').trim().slice(0, max);
}

export function consultationAmountKobo() {
  return Number(
    process.env.SUREIMPORTS_CONSULTATION_AMOUNT_KOBO ||
      process.env.CONSULTATION_AMOUNT_KOBO ||
      0,
  );
}

export function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

function timezoneOffsetMinutes(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const byType: Record<string, string> = {};
  parts.forEach((part) => {
    byType[part.type] = part.value;
  });
  const asUtc = Date.UTC(
    Number(byType.year || 0),
    Number(byType.month || 1) - 1,
    Number(byType.day || 1),
    Number(byType.hour || 0),
    Number(byType.minute || 0),
    Number(byType.second || 0),
  );
  return (asUtc - date.getTime()) / 60000;
}

function lagosLocalToUtc(year: number, month: number, day: number, hour: number) {
  const naiveUtcMs = Date.UTC(year, month - 1, day, hour, 0, 0);
  const probe = new Date(naiveUtcMs);
  const offsetMin = timezoneOffsetMinutes(probe, CONSULTATION_TIMEZONE);
  return new Date(naiveUtcMs - offsetMin * 60000);
}

function lagosDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: CONSULTATION_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || '';
  return {
    year: Number(get('year') || 0),
    month: Number(get('month') || 0),
    day: Number(get('day') || 0),
    weekday: get('weekday').toLowerCase(),
  };
}

export function slotLabel(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: CONSULTATION_TIMEZONE,
  }).format(date);
}

export function buildCandidateSlots(days = 21) {
  const now = new Date();
  const slots: Array<{ startIso: string; endIso: string; label: string }> = [];
  const lagosHours = [10, 12, 14, 16];

  for (let index = 0; index < days; index += 1) {
    const cursor = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
    const parts = lagosDateParts(cursor);
    if (!parts.year || !parts.month || !parts.day) continue;
    if (parts.weekday === 'sat' || parts.weekday === 'sun') continue;

    for (const hour of lagosHours) {
      const startDate = lagosLocalToUtc(parts.year, parts.month, parts.day, hour);
      if (startDate.getTime() <= now.getTime() + 2 * 60 * 60 * 1000) continue;
      const endDate = new Date(
        startDate.getTime() + CONSULTATION_DURATION_MINUTES * 60 * 1000,
      );
      slots.push({
        startIso: startDate.toISOString(),
        endIso: endDate.toISOString(),
        label: slotLabel(startDate.toISOString()),
      });
    }
  }

  return slots.sort((first, second) => first.startIso.localeCompare(second.startIso));
}

export function isCandidateSlot(slotStartIso: string) {
  return buildCandidateSlots(35).some((slot) => slot.startIso === slotStartIso);
}

async function zoomAccessToken() {
  const now = Date.now();
  if (zoomTokenCache.token && zoomTokenCache.expiresAtMs - 30000 > now) {
    return zoomTokenCache.token;
  }

  const accountId = clean(process.env.ZOOM_ACCOUNT_ID);
  const clientId = clean(process.env.ZOOM_CLIENT_ID);
  const clientSecret = clean(process.env.ZOOM_CLIENT_SECRET);
  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom credentials are not configured.');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.access_token) {
    throw new Error(data?.message || data?.reason || 'Zoom authentication failed.');
  }

  zoomTokenCache = {
    token: data.access_token,
    expiresAtMs: now + Math.max(60, Number(data.expires_in || 3600)) * 1000,
  };
  return zoomTokenCache.token;
}

export async function createZoomMeeting(input: {
  topic: string;
  agenda: string;
  startTimeIso: string;
  durationMinutes?: number;
}) {
  const hostId = clean(process.env.ZOOM_HOST_USER_ID);
  if (!hostId) throw new Error('ZOOM_HOST_USER_ID is not configured.');

  const token = await zoomAccessToken();
  const response = await fetch(
    `https://api.zoom.us/v2/users/${encodeURIComponent(hostId)}/meetings`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        topic: clean(input.topic, 200) || 'Sure Imports Consultation',
        type: 2,
        start_time: input.startTimeIso,
        duration: input.durationMinutes || CONSULTATION_DURATION_MINUTES,
        timezone: CONSULTATION_TIMEZONE,
        agenda: clean(input.agenda, 1500),
        settings: {
          join_before_host: false,
          waiting_room: true,
          approval_type: 2,
          mute_upon_entry: true,
          registrants_email_notification: false,
        },
      }),
    },
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id) {
    throw new Error(data?.message || data?.reason || 'Could not create Zoom meeting.');
  }
  return data as { id: string | number; join_url?: string; start_url?: string };
}

export async function updateZoomMeeting(input: {
  meetingId: string;
  topic?: string;
  agenda?: string;
  startTimeIso: string;
  durationMinutes?: number;
}) {
  const meetingId = clean(input.meetingId, 120);
  if (!meetingId) return;

  const token = await zoomAccessToken();
  const response = await fetch(
    `https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        topic: clean(input.topic, 200) || 'Sure Imports Consultation',
        start_time: input.startTimeIso,
        duration: input.durationMinutes || CONSULTATION_DURATION_MINUTES,
        timezone: CONSULTATION_TIMEZONE,
        agenda: clean(input.agenda, 1500),
      }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || data?.reason || 'Could not update Zoom meeting.');
  }
}

export async function cancelZoomMeeting(meetingId: string) {
  const cleanMeetingId = clean(meetingId, 120);
  if (!cleanMeetingId) return;

  const token = await zoomAccessToken();
  const response = await fetch(
    `https://api.zoom.us/v2/meetings/${encodeURIComponent(cleanMeetingId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok && response.status !== 404) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || data?.reason || 'Could not cancel Zoom meeting.');
  }
}

export function bookingTokens() {
  return {
    pidBooking: `CONSULT${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    manageToken: `${crypto.randomUUID()}${crypto.randomUUID().replace(/-/g, '')}`,
  };
}
