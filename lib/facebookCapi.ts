import crypto from 'crypto';

type CapiUserDataInput = {
  email?: string | null;
  phone?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

type CapiLeadEventInput = {
  pixelId: string;
  accessToken: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string | null;
  actionSource?: 'website';
  testEventCode?: string | null;
  userData: CapiUserDataInput;
  customData?: Record<string, string | number | boolean | null | undefined>;
};

const normalize = (value: string) => value.trim().toLowerCase();

const sha256 = (value: string) =>
  crypto.createHash('sha256').update(value).digest('hex');

const maybeHashEmail = (email?: string | null) => {
  if (!email) return undefined;
  const normalized = normalize(email);
  return normalized ? sha256(normalized) : undefined;
};

const maybeHashPhone = (phone?: string | null) => {
  if (!phone) return undefined;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly ? sha256(digitsOnly) : undefined;
};

export async function sendFacebookLeadCapiEvent(input: CapiLeadEventInput) {
  const endpoint = `https://graph.facebook.com/v23.0/${input.pixelId}/events`;

  const userData: Record<string, string> = {};
  const em = maybeHashEmail(input.userData.email);
  const ph = maybeHashPhone(input.userData.phone);

  if (em) userData.em = em;
  if (ph) userData.ph = ph;
  if (input.userData.clientIpAddress)
    userData.client_ip_address = input.userData.clientIpAddress;
  if (input.userData.clientUserAgent)
    userData.client_user_agent = input.userData.clientUserAgent;
  if (input.userData.fbp) userData.fbp = input.userData.fbp;
  if (input.userData.fbc) userData.fbc = input.userData.fbc;

  const customData = Object.fromEntries(
    Object.entries(input.customData || {}).filter(([, value]) => value != null),
  );

  const body = {
    data: [
      {
        event_name: 'Lead',
        event_time: input.eventTime || Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: input.actionSource || 'website',
        event_source_url: input.eventSourceUrl || undefined,
        user_data: userData,
        custom_data: customData,
      },
    ],
    ...(input.testEventCode ? { test_event_code: input.testEventCode } : {}),
  };

  const response = await fetch(
    `${endpoint}?access_token=${input.accessToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Facebook CAPI request failed (${response.status}): ${text}`,
    );
  }

  return response.json();
}
