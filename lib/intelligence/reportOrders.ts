import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { sendMail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';

export async function getOrCreateReportBuyer(input: {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
}) {
  const existing = await prisma.users.findUnique({
    where: { userEmail: input.email },
  });
  if (existing) return existing;

  const data = {
    pidUser: `CUS${randomGenerator(10)}`,
    userFirstname: input.firstName || 'Customer',
    userLastname: input.lastName || '',
    userEmail: input.email,
    email: input.email,
    userPassword: bcrypt.hashSync(randomGenerator(28), 8),
    userSession: bcrypt.hashSync(randomGenerator(12), 8),
    country: input.country,
    userCountry: input.country,
    userCid: 'VERIFIED',
    loginStatus: 'RESET',
    userStatus: 'AL1',
    userAffiliateCode: randomGenerator(6),
    userAffiliateRef: 'supplier-intelligence-report',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.users.create({
        data: {
          ...data,
          pidUser: attempt ? `CUS${randomGenerator(10)}` : data.pidUser,
        },
      });
    } catch (error) {
      const user = await prisma.users.findUnique({
        where: { userEmail: input.email },
      });
      if (user) return user;
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2002'
      )
        throw error;
    }
  }
  throw new Error('Unable to create a Sure Imports account.');
}

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
    const downloadUrl = siteUrl(
      `/api/intelligence/reports/download?token=${encodeURIComponent(order.downloadToken)}`,
    );
    await sendMail({
      to: order.email,
      name: order.firstName || 'Customer',
      subject: `Your Supplier Intelligence report is ready: ${report.title}`,
      body: `<p>Thank you for your purchase. Your <strong>${report.editionLabel}</strong> edition is ready.</p><p><a href="${downloadUrl}">Download your Supplier Intelligence report</a></p><p>You can also find purchased reports under <a href="${siteUrl('/dashboard/intelligence/reports')}">My Reports</a>. If this is your first Sure Imports purchase, use the password reset option with this email address to access your account.</p>`,
    });
  }

  return { order: paidOrder, report, version };
}
