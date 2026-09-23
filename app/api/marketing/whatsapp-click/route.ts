import { createHmac } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import {
  clickSchema,
  siteForOrigin,
  whatsappService,
} from '@/lib/marketing/whatsappPolicy';

function reply(origin: string | null, status = 204) {
  return new Response(null, {
    status,
    headers: {
      ...(siteForOrigin(origin)
        ? {
            'Access-Control-Allow-Origin': origin!,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        : {}),
      Vary: 'Origin',
      'Cache-Control': 'no-store',
    },
  });
}
export async function OPTIONS(request: Request) {
  return reply(
    request.headers.get('origin'),
    siteForOrigin(request.headers.get('origin')) ? 204 : 403,
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const site = siteForOrigin(origin);
  if (!site) return reply(origin, 403);
  // Local and preview requests never enter the production reports.
  if (process.env.VERCEL_ENV !== 'production') return reply(origin);
  if (
    /bot|crawler|spider|headless|preview/i.test(
      request.headers.get('user-agent') || '',
    )
  )
    return reply(origin);
  if (Number(request.headers.get('content-length') || 0) > 4096)
    return reply(origin, 413);
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply(origin, 413);
    const parsed = clickSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return reply(origin, 400);
    const event = parsed.data;
    const contacts = await prisma.$queryRaw<
      Array<{ phone: string | null; messageId: string | null }>
    >`SELECT phone, messageId FROM admin_whatsapp_contacts WHERE isActive = true`;
    const destinations = new Set([
      '447881194138',
      '2348037649956',
      'message/CUR7YKW3K3RBA1',
    ]);
    for (const contact of contacts) {
      if (contact.phone) destinations.add(contact.phone.replace(/\D/g, ''));
      if (contact.messageId) destinations.add(`message/${contact.messageId}`);
    }
    // Supplier contacts and partner-owned WhatsApp numbers are not our leads.
    if (!destinations.has(event.destination)) return reply(origin);
    const secret = process.env.CRON_SECRET;
    if (!secret) return reply(origin, 503);
    const ip =
      request.headers.get('x-vercel-forwarded-for') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown';
    const hash = createHmac('sha256', secret)
      .update(`wa:${new Date().toISOString().slice(0, 10)}:${ip}`)
      .digest('hex');
    const windowStart = new Date(Math.floor(Date.now() / 60000) * 60000);
    await prisma.$executeRaw`INSERT INTO whatsapp_rate_limits(scopeHash,windowStart,attempts) VALUES(${hash},${windowStart},1)
      ON DUPLICATE KEY UPDATE attempts=IF(windowStart=VALUES(windowStart),attempts+1,1),windowStart=VALUES(windowStart)`;
    const limits = await prisma.$queryRaw<
      Array<{ attempts: number }>
    >`SELECT attempts FROM whatsapp_rate_limits WHERE scopeHash=${hash}`;
    if (limits[0]?.attempts > 30) return reply(origin, 429);
    const audience =
      /\/dashboard(?:\/|$)|\/internal(?:\/|$)|\/agent-app(?:\/|$)/.test(
        event.path,
      )
        ? 'support'
        : 'sales';
    await prisma.$executeRaw`INSERT INTO whatsapp_clicks(id,site,path,destination,placement,device,sessionId,source,campaign,service,audience)
      VALUES(${event.id},${site},${event.path},${event.destination},${event.placement},${event.device},${event.session},${event.source},${event.campaign},${whatsappService(event.path)},${audience})
      ON DUPLICATE KEY UPDATE id=id`;
    await prisma.$executeRaw`DELETE FROM whatsapp_rate_limits WHERE windowStart < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 2 DAY) LIMIT 100`;
    return reply(origin);
  } catch {
    console.error('WhatsApp click recording failed');
    return reply(origin, 503);
  }
}
