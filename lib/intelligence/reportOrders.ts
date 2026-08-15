import { randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';

import {
  requestPublicAccountMarketingOptIn,
  resolvePublicAccount,
} from '@/lib/auth/resolvePublicAccount';
import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import {
  isTerminalReportOrderStatus,
  TERMINAL_REPORT_ORDER_STATUSES,
} from '@/lib/intelligence/reportOrderPolicy';

function siteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${base.replace(/\/$/, '')}${path}`;
}

function escapeHtml(value: string | null | undefined) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function eventId() {
  return `SIRE${randomBytes(12).toString('hex').toUpperCase()}`;
}

export async function recordReportOrderEvent(input: {
  orderId: string;
  source: string;
  eventType: string;
  providerEventId?: string | null;
  previousStatus?: string | null;
  nextStatus?: string | null;
  details?: Prisma.InputJsonValue;
}) {
  try {
    await prisma.intelligence_report_order_events.create({
      data: {
        pidEvent: eventId(),
        orderId: input.orderId,
        source: input.source.slice(0, 40),
        eventType: input.eventType.slice(0, 120),
        providerEventId: input.providerEventId?.slice(0, 160) || null,
        previousStatus: input.previousStatus?.slice(0, 40) || null,
        nextStatus: input.nextStatus?.slice(0, 40) || null,
        details: input.details,
      },
    });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      input.providerEventId
    ) {
      return false;
    }
    throw error;
  }
}

export async function confirmReportOrderPayment(input: {
  pidOrder: string;
  source: 'paystack' | 'paypal' | 'callback' | 'reconciliation';
  paidAt?: Date | null;
  providerEventId?: string | null;
  providerCaptureReference?: string | null;
}) {
  const existing = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder: input.pidOrder },
  });
  if (!existing) throw new Error('Report order was not found.');
  if (isTerminalReportOrderStatus(existing.status)) return existing;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const paymentUpdate = await prisma.intelligence_report_orders.updateMany({
    where: {
      pidOrder: input.pidOrder,
      status: { notIn: [...TERMINAL_REPORT_ORDER_STATUSES] },
    },
    data: {
      status: 'paid',
      paidAt: existing.paidAt || input.paidAt || now,
      downloadTokenExpiresAt:
        !existing.downloadTokenExpiresAt ||
        existing.downloadTokenExpiresAt.getTime() < now.getTime()
          ? expiresAt
          : existing.downloadTokenExpiresAt,
      providerCaptureReference:
        input.providerCaptureReference || existing.providerCaptureReference,
      lastProviderEvent: input.providerEventId || input.source,
      updatedAt: now,
    },
  });
  const updated = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder: input.pidOrder },
  });
  if (!updated) throw new Error('Report order was not found.');
  if (paymentUpdate.count === 0) return updated;
  if (existing.status !== 'paid' || input.providerEventId) {
    await recordReportOrderEvent({
      orderId: input.pidOrder,
      source: input.source,
      eventType: 'payment_confirmed',
      providerEventId: input.providerEventId,
      previousStatus: existing.status,
      nextStatus: 'paid',
    });
  }
  return updated;
}

async function ensureBuyer(order: {
  pidOrder: string;
  pidUser: string | null;
  email: string;
  firstName: string | null;
  lastName: string | null;
  billingCountry: string | null;
}) {
  if (order.pidUser) {
    const user = await prisma.users.findUnique({
      where: { pidUser: order.pidUser },
    });
    if (user) return { user, createdNewAccount: false };
  }

  const existing = await prisma.users.findUnique({
    where: { userEmail: order.email.trim().toLowerCase() },
  });
  if (existing) {
    await prisma.intelligence_report_orders.update({
      where: { pidOrder: order.pidOrder },
      data: { pidUser: existing.pidUser, updatedAt: new Date() },
    });
    return { user: existing, createdNewAccount: false };
  }

  const account = await resolvePublicAccount({
    email: order.email,
    firstName: order.firstName || undefined,
    lastName: order.lastName || undefined,
    country: order.billingCountry || undefined,
    affiliateRef: 'supplier-intelligence-report',
    accountSetupKey: `supplier_intelligence_report:${order.pidOrder}`,
  });
  if (account.status !== 'ready') {
    const concurrent = await prisma.users.findUnique({
      where: { userEmail: order.email.trim().toLowerCase() },
    });
    if (!concurrent) throw new Error('Unable to connect the buyer account.');
    return { user: concurrent, createdNewAccount: false };
  }
  await prisma.intelligence_report_orders.update({
    where: { pidOrder: order.pidOrder },
    data: { pidUser: account.user.pidUser, updatedAt: new Date() },
  });
  return {
    user: account.user,
    createdNewAccount: account.createdNewAccount,
  };
}

export async function deliverReportOrder(pidOrder: string) {
  const order = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder },
  });
  if (!order) throw new Error('Report order was not found.');
  if (order.status !== 'paid') {
    throw new Error('Only a paid report order can be fulfilled.');
  }
  const [report, version] = await Promise.all([
    prisma.intelligence_report_products.findUnique({
      where: { pidReport: order.reportId },
    }),
    prisma.intelligence_report_versions.findUnique({
      where: { pidVersion: order.versionId },
    }),
  ]);
  if (!report || !version?.pdfUrl || !version.pdfPublicId) {
    throw new Error('The purchased report edition is unavailable.');
  }
  if (order.fulfilledAt) return { order, report, version };

  const now = new Date();
  const claim = await prisma.intelligence_report_orders.updateMany({
    where: {
      pidOrder,
      status: 'paid',
      fulfilledAt: null,
      OR: [
        { fulfillmentClaimedAt: null },
        {
          fulfillmentClaimedAt: {
            lt: new Date(now.getTime() - 10 * 60 * 1000),
          },
        },
      ],
    },
    data: {
      fulfillmentClaimedAt: now,
      fulfillmentAttempts: { increment: 1 },
      lastFulfillmentAttemptAt: now,
      fulfillmentError: null,
      updatedAt: now,
    },
  });
  if (claim.count === 0) {
    const latest = await prisma.intelligence_report_orders.findUnique({
      where: { pidOrder },
    });
    return { order: latest || order, report, version };
  }

  try {
    const { user: buyer, createdNewAccount } = await ensureBuyer(order);
    const downloadUrl = siteUrl(
      `/api/intelligence/reports/download?token=${encodeURIComponent(order.downloadToken)}`,
    );
    const accountSetupIsActive =
      buyer.loginKey === `supplier_intelligence_report:${pidOrder}` &&
      Boolean(buyer.cidStatus) &&
      Boolean(buyer.loginStamp) &&
      new Date(String(buyer.loginStamp)).getTime() > Date.now();
    const accountAccess = accountSetupIsActive
      ? `<p>We created a Sure Imports account for this email so your purchase remains available in <strong>My Supplier Reports</strong>.</p><p><a href="${siteUrl(`/auth/password-reset-link?pidUser=${encodeURIComponent(buyer.pidUser)}&resetCode=${encodeURIComponent(String(buyer.cidStatus))}`)}">Set your Sure Imports password</a>. This secure link expires after 48 hours.</p>`
      : `<p>You can also find this purchase under <a href="${siteUrl('/dashboard/my-reports')}">My Supplier Reports</a>. Sign in with this email address. If you do not know the password, use the secure password-reset option.</p>`;
    await sendMail({
      to: order.email,
      name: order.firstName || 'Customer',
      subject: `Your Supplier Intelligence report is ready: ${report.title}`,
      bodyTitle: 'Your Supplier Intelligence report is ready',
      body: `<p>Thank you for your purchase. Your <strong>${escapeHtml(version.editionLabel)}</strong> edition of <strong>${escapeHtml(report.title)}</strong> is ready to download.</p>${accountAccess}`,
      secondaryBody:
        '<p>This email download link expires after 7 days. Your purchased edition remains available in My Supplier Reports.</p>',
      buttonTitle: 'Download my report',
      buttonLink: downloadUrl,
    });
    if (createdNewAccount) {
      await requestPublicAccountMarketingOptIn({
        user: buyer,
        source: 'paid_supplier_report_account',
        context: {
          pidUser: buyer.pidUser,
          pidOrder,
          channelOwner: 'SES',
        },
      }).catch((error) => {
        console.error('Supplier report marketing opt-in email failed:', error);
      });
    }
    await prisma.intelligence_report_orders.updateMany({
      where: { pidOrder, fulfillmentClaimedAt: now, status: 'paid' },
      data: {
        fulfilledAt: new Date(),
        fulfillmentClaimedAt: null,
        fulfillmentError: null,
        updatedAt: new Date(),
      },
    });
    await recordReportOrderEvent({
      orderId: pidOrder,
      source: 'fulfillment',
      eventType: 'delivery_email_sent',
      nextStatus: 'paid',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown fulfillment error';
    await prisma.intelligence_report_orders.updateMany({
      where: { pidOrder, fulfillmentClaimedAt: now },
      data: {
        fulfillmentClaimedAt: null,
        fulfillmentError: message.slice(0, 4000),
        updatedAt: new Date(),
      },
    });
    await recordReportOrderEvent({
      orderId: pidOrder,
      source: 'fulfillment',
      eventType: 'delivery_failed',
      nextStatus: 'paid',
      details: { message: message.slice(0, 1000) },
    });
    throw error;
  }

  const fulfilled = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder },
  });
  return { order: fulfilled || order, report, version };
}

export async function fulfillReportOrder(pidOrder: string) {
  await confirmReportOrderPayment({ pidOrder, source: 'callback' });
  return deliverReportOrder(pidOrder);
}

export async function transitionReportOrderAccess(input: {
  pidOrder: string;
  status: 'refunded' | 'reversed' | 'disputed' | 'revoked';
  source: 'paystack' | 'paypal' | 'admin';
  eventType: string;
  providerEventId?: string | null;
  reason?: string | null;
}) {
  const order = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder: input.pidOrder },
  });
  if (!order) return null;
  if (input.providerEventId) {
    const accepted = await recordReportOrderEvent({
      orderId: input.pidOrder,
      source: input.source,
      eventType: input.eventType,
      providerEventId: input.providerEventId,
      previousStatus: order.status,
      nextStatus: input.status,
      details: input.reason
        ? { reason: input.reason.slice(0, 500) }
        : undefined,
    });
    if (!accepted) return order;
  }
  return prisma.intelligence_report_orders.update({
    where: { pidOrder: input.pidOrder },
    data: {
      status: input.status,
      refundedAt: input.status === 'refunded' ? new Date() : order.refundedAt,
      revokedAt: new Date(),
      revocationReason: input.reason?.slice(0, 500) || input.eventType,
      lastProviderEvent: input.providerEventId || input.eventType,
      updatedAt: new Date(),
    },
  });
}
