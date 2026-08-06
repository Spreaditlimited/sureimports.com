import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

function siteUrl(path: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    'https://www.sureimports.com';
  return `${base.replace(/\/$/, '')}${path}`;
}

export async function fulfillReportOrder(pidOrder: string) {
  const order = await prisma.intelligence_report_orders.findUnique({
    where: { pidOrder },
  });
  if (!order) throw new Error('Report order was not found.');
  const report = await prisma.intelligence_report_products.findUnique({
    where: { pidReport: order.reportId },
  });
  const version = await prisma.intelligence_report_versions.findUnique({
    where: { pidVersion: order.versionId },
  });
  if (!report || !version?.pdfUrl)
    throw new Error('The purchased report edition is unavailable.');

  const now = new Date();
  const paidOrder = await prisma.intelligence_report_orders.update({
    where: { pidOrder },
    data: {
      status: 'paid',
      paidAt: order.paidAt || now,
      updatedAt: now,
    },
  });

  const fulfilmentClaim = await prisma.intelligence_report_orders.updateMany({
    where: { pidOrder, fulfilledAt: null },
    data: { fulfilledAt: now, updatedAt: now },
  });

  if (fulfilmentClaim.count === 1) {
    const buyer = order.pidUser
      ? await prisma.users.findUnique({ where: { pidUser: order.pidUser } })
      : null;
    const downloadUrl = siteUrl(
      `/api/intelligence/reports/download?token=${encodeURIComponent(order.downloadToken)}`,
    );
    const accountSetupIsActive =
      buyer?.loginKey === `supplier_intelligence_report:${pidOrder}` &&
      Boolean(buyer.cidStatus) &&
      Boolean(buyer.loginStamp) &&
      new Date(String(buyer.loginStamp)).getTime() > Date.now();
    const accountAccess = accountSetupIsActive
      ? `<p>We created a Sure Imports account for this email so your purchase remains available in <strong>My Supplier Reports</strong>.</p><p><a href="${siteUrl(`/auth/password-reset-link?pidUser=${encodeURIComponent(buyer!.pidUser)}&resetCode=${encodeURIComponent(String(buyer!.cidStatus))}`)}">Set your Sure Imports password</a>. This secure link expires after 48 hours.</p>`
      : `<p>You can also find this purchase under <a href="${siteUrl('/dashboard/my-reports')}">My Supplier Reports</a>. Sign in with this email address. If you do not know the password, use the secure password-reset option.</p>`;
    try {
      await sendMail({
        to: order.email,
        name: order.firstName || 'Customer',
        subject: `Your Supplier Intelligence report is ready: ${report.title}`,
        bodyTitle: 'Your Supplier Intelligence report is ready',
        body: `<p>Thank you for your purchase. Your <strong>${report.editionLabel}</strong> edition of <strong>${report.title}</strong> is ready to download.</p>${accountAccess}`,
        secondaryBody:
          '<p>Keep this email for convenient access to this exact purchased edition.</p>',
        buttonTitle: 'Download my report',
        buttonLink: downloadUrl,
      });
    } catch (error) {
      await prisma.intelligence_report_orders.updateMany({
        where: { pidOrder, fulfilledAt: now },
        data: { fulfilledAt: null, updatedAt: new Date() },
      });
      throw error;
    }
  }

  return { order: paidOrder, report, version };
}
