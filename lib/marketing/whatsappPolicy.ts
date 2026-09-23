import { z } from 'zod';

export const WHATSAPP_SITES: Record<string, string> = {
  'www.sureimports.com': 'sureimports',
  'sureimports.com': 'sureimports',
  'linescout.sureimports.com': 'linescout',
  'affiliate.sureimports.com': 'affiliate',
  'partner.sureimports.com': 'partner',
};
export const clickSchema = z
  .object({
    id: z.string().uuid(),
    path: z
      .string()
      .max(250)
      .regex(/^\/[a-zA-Z0-9/_-]*$/),
    destination: z
      .string()
      .max(80)
      .regex(/^(?:\d{8,15}|message\/[A-Za-z0-9]+)$/),
    placement: z.enum(['floating', 'hero', 'footer', 'page']),
    device: z.enum(['mobile', 'desktop']),
    session: z.string().uuid().nullable().default(null),
    source: z
      .string()
      .max(80)
      .regex(/^[\w .-]*$/)
      .default(''),
    campaign: z
      .string()
      .max(80)
      .regex(/^[\w .-]*$/)
      .default(''),
  })
  .strict();

export function siteForOrigin(origin: string | null) {
  if (!origin) return null;
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && !url.port
      ? WHATSAPP_SITES[url.hostname] || null
      : null;
  } catch {
    return null;
  }
}

export function whatsappService(path: string) {
  if (/white-label/.test(path)) return 'White label';
  if (/shipping|ship-with/.test(path)) return 'Shipping';
  if (/buy-from|procurement/.test(path)) return 'Procurement';
  if (/intelligence|report/.test(path)) return 'Supplier intelligence';
  if (/shop|product/.test(path)) return 'Shop';
  if (/china-to-uk/.test(path)) return 'UK imports';
  return 'General';
}

export function phoneIdentity(value: string) {
  const phone = value.trim().replace(/[\s().-]/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(phone))
    throw new Error(
      'Enter the WhatsApp number with its country code, for example +2348031234567.',
    );
  return phone;
}
