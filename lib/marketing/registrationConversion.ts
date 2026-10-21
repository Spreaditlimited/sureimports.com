import { createHash } from 'crypto';
import { after } from 'next/server';
import { sendFacebookLeadCapiEvent } from '@/lib/facebookCapi';

export type RegistrationConversion = { eventId: string; method: string };
type Attribution = { fbp?: unknown; fbc?: unknown; pageUrl?: unknown };
const bounded = (v: unknown, max = 512) =>
  typeof v === 'string' && v.length <= max ? v : undefined;
export function registrationEventId(accountId: string) {
  return `registration_${createHash('sha256').update(`sureimports:${accountId}`).digest('hex')}`;
}
function cookie(req: Request, name: string) {
  const value = req.headers
    .get('cookie')
    ?.split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`))
    ?.slice(name.length + 1);
  return bounded(value);
}
export function registrationAttribution(
  request: Request,
  raw: unknown,
): Attribution {
  const data = raw && typeof raw === 'object' ? (raw as Attribution) : {};
  let pageUrl = `${new URL(request.url).origin}/auth/signup`;
  try {
    const url = new URL(String(data.pageUrl || ''));
    if (url.origin === new URL(request.url).origin)
      pageUrl = url.origin + url.pathname;
  } catch {
    /* Use the safe signup URL. */
  }
  const validCookie = (value: unknown) => {
    const text = bounded(value);
    return text && /^fb\.\d+\.\d+\.[A-Za-z0-9_.-]+$/.test(text)
      ? text
      : undefined;
  };
  return {
    pageUrl,
    fbp: validCookie(cookie(request, '_fbp') || data.fbp),
    fbc: validCookie(cookie(request, '_fbc') || data.fbc),
  };
}

// Called only after a new account has committed, never during login or linking.
export function scheduleRegistrationConversion(input: {
  request: Request;
  accountId: string;
  email: string;
  method: 'email' | 'google' | 'apple';
  attribution?: unknown;
}): RegistrationConversion | null {
  if (cookie(input.request, 'consent') === 'false') return null;
  const eventId = registrationEventId(input.accountId);
  const attribution = registrationAttribution(input.request, input.attribution);
  const eventTime = Math.floor(Date.now() / 1000);
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;
  if (pixelId && accessToken) {
    after(async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await sendFacebookLeadCapiEvent({
            eventName: 'CompleteRegistration',
            pixelId,
            accessToken,
            eventId,
            eventTime,
            eventSourceUrl: String(attribution.pageUrl),
            testEventCode: process.env.FACEBOOK_TEST_EVENT_CODE || null,
            userData: {
              email: input.email,
              clientIpAddress:
                input.request.headers
                  .get('x-forwarded-for')
                  ?.split(',')[0]
                  ?.trim() || input.request.headers.get('x-real-ip'),
              clientUserAgent: input.request.headers.get('user-agent'),
              fbp: attribution.fbp as string | undefined,
              fbc: attribution.fbc as string | undefined,
            },
            customData: {
              content_name: 'Sure Imports account',
              status: true,
              registration_method: input.method,
            },
          });
          console.info('Meta registration conversion delivered', { eventId });
          return;
        } catch (error) {
          const status = (error as { status?: number })?.status;
          const retryable = !status || status === 429 || status >= 500;
          if (!retryable || attempt === 2) {
            console.error('Meta registration conversion failed', {
              eventId,
              status: status || 'network_or_acknowledgement',
              attempts: attempt + 1,
            });
            return;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, (attempt + 1) * 500),
          );
        }
      }
    });
  } else {
    console.warn('Meta registration CAPI not configured', {
      pixelConfigured: Boolean(pixelId),
      tokenConfigured: Boolean(accessToken),
    });
  }
  return { eventId, method: input.method };
}
