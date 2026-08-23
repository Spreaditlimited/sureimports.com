import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const assessmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  organisation: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(80),
  fleetSize: z.string().trim().max(40).optional().default('Not specified'),
  liveCommand: z.string().trim().max(40).optional().default('Undecided'),
  timeframe: z.string().trim().max(60).optional().default('Not specified'),
  requirements: z.string().trim().min(20).max(3000),
  source: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default('body-camera-solutions'),
  website: z.string().max(200).optional().default(''),
});

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 4;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[character] || character,
  );
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const recent = (requestLog.get(identifier) || []).filter(
    (time) => now - time < WINDOW_MS,
  );
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  requestLog.set(identifier, recent);
  return false;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        message: 'Too many requests. Please wait a few minutes and try again.',
      },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'The request could not be read.' },
      { status: 400 },
    );
  }

  const parsed = assessmentSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Please complete all required fields with valid information.',
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  if (input.website) {
    return NextResponse.json({
      message: 'Your assessment request has been received.',
    });
  }

  const safe = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, escapeHtml(value)]),
  ) as typeof input;
  const adminEmail =
    process.env.BODY_CAMERA_ADMIN_EMAIL ||
    process.env.NOTIFICATIONS_ADMIN_EMAIL ||
    'hello@sureimports.com';
  const subject = `Body camera assessment — ${safe.organisation}`;
  const pidEnquiry = `BCENQ${Date.now().toString(36).toUpperCase()}${randomUUID()
    .replace(/-/g, '')
    .slice(0, 8)
    .toUpperCase()}`;

  try {
    await prisma.body_camera_enquiries.create({
      data: {
        pidEnquiry,
        name: input.name,
        email: input.email,
        organisation: input.organisation,
        phone: input.phone,
        country: input.country,
        fleetSize: input.fleetSize,
        liveCommand: input.liveCommand,
        timeframe: input.timeframe,
        requirements: input.requirements,
        source: input.source,
      },
    });
  } catch (error) {
    console.error('Body camera assessment storage failed', error);
    return NextResponse.json(
      {
        message:
          'We could not submit your request right now. Please email hello@sureimports.com.',
      },
      { status: 503 },
    );
  }

  const adminBody = `
    <p>A new body-camera solution assessment has been submitted.</p>
    <table style="border-collapse:collapse;width:100%;margin-top:16px">
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Name</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Organisation</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.organisation}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Email</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.email}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.phone}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Country</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.country}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Fleet size</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.fleetSize}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Live command</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.liveCommand}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Timeframe</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.timeframe}</td></tr>
      <tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Source</strong></td><td style="padding:8px;border:1px solid #e2e8f0">${safe.source}</td></tr>
    </table>
    <p style="margin-top:20px"><strong>Requirements</strong></p><p>${safe.requirements.replace(/\n/g, '<br />')}</p>
  `;

  const [adminResult, customerResult] = await Promise.allSettled([
    sendMail({
      to: adminEmail,
      name: 'Sure Imports team',
      subject,
      body: adminBody,
      bodyTitle: 'New body camera solution enquiry',
      buttonTitle: 'Open enquiry in admin',
      buttonLink: `${process.env.ADMIN_SITE_URL || 'https://admin.sureimports.com'}/dashboard/body-camera-enquiries?enquiry=${encodeURIComponent(pidEnquiry)}`,
    }),
    sendMail({
      to: input.email,
      name: input.name,
      subject: 'We received your body camera solution request',
      bodyTitle: 'Your assessment request is with our team',
      body: `<p>Thank you for telling us about ${safe.organisation}. We have received your requirements and will review the camera fleet, connectivity, evidence-management and deployment considerations.</p>`,
      secondaryBody:
        '<p>A Sure Imports representative will contact you to clarify the operational and commercial scope.</p>',
      buttonTitle: 'Explore Body Camera Solutions',
      buttonLink: 'https://www.sureimports.com/body-camera-solutions',
    }),
  ]);

  const notificationErrors = [adminResult, customerResult]
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map((result) =>
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason || 'Email delivery failed'),
    )
    .join(' | ')
    .slice(0, 2000);

  try {
    await prisma.body_camera_enquiries.update({
      where: { pidEnquiry },
      data: {
        adminNotificationStatus:
          adminResult.status === 'fulfilled' ? 'sent' : 'failed',
        customerNotificationStatus:
          customerResult.status === 'fulfilled' ? 'sent' : 'failed',
        notificationError: notificationErrors || null,
      },
    });
  } catch (error) {
    console.error('Body camera notification status update failed', error);
  }

  if (adminResult.status === 'rejected') {
    console.error('Body camera assessment notification failed');
  }

  return NextResponse.json({
    message:
      'Thank you. Our enterprise solutions team will review your requirements and contact you.',
  });
}
