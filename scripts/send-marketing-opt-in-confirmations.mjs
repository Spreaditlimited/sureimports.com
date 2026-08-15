import { createHash, randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cutoff = new Date(process.env.SES_MARKETING_CUTOVER_AT || '2026-08-13T23:00:00.000Z');
const rootUrl = (process.env.ROOT_URL || 'https://www.sureimports.com').replace(/\/$/, '');
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
  tls: { minVersion: 'TLSv1.2' },
});

function hash(token) {
  return createHash('sha256').update(token).digest('hex');
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function emailHtml({ firstName, confirmationUrl }) {
  const greeting = firstName?.trim() ? `Hello ${escapeHtml(firstName.trim())},` : 'Hello,';
  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#111827"><table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 10px"><tr><td align="center"><table width="680" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border:1px solid #dbe2ea;border-radius:14px;overflow:hidden"><tr><td style="padding:20px 28px;border-bottom:1px solid #e5e7eb"><img src="https://www.sureimports.com/images/logo.png" height="38" alt="Sure Imports"></td></tr><tr><td style="padding:30px 28px"><h1 style="font-size:24px;line-height:1.3;margin:0 0 16px">Would you like to receive our practical import emails?</h1><p style="font-size:15px;line-height:1.7;color:#334155">${greeting}<br><br>You recently registered with Sure Imports or requested one of our resources. We would like to send you practical guidance about buying from China, supplier checks, shipping and import decisions.<br><br><strong>We will only send these emails if you confirm below.</strong> If you do not want them, simply ignore this message and nothing further will be sent.</p><a href="${confirmationUrl}" style="display:inline-block;margin-top:8px;background:#f97316;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:700">Confirm email updates</a><p style="font-size:12px;line-height:1.6;color:#64748b;margin-top:18px">This link expires in 7 days. If the button does not work, copy this link:<br><a href="${confirmationUrl}" style="color:#1558b0;word-break:break-all">${confirmationUrl}</a></p></td></tr><tr><td style="padding:18px 28px;background:#fafbfd;border-top:1px solid #e5e7eb;font-size:12px;line-height:1.7;color:#64748b">Sure Imports · Lagos, Nigeria · Guangzhou, China<br><a href="https://www.sureimports.com" style="color:#1558b0">www.sureimports.com</a></td></tr></table></td></tr></table></body></html>`;
}

try {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) throw new Error('Hostinger SMTP is not configured.');
  const contacts = await prisma.marketing_contacts.findMany({
    where: {
      createdAt: { gte: cutoff },
      optInRequestedAt: null,
      consentStatus: { in: ['OPTED_IN', 'PENDING_CONFIRMATION'] },
    },
    orderBy: { createdAt: 'asc' },
  });

  for (const contact of contacts) {
    const token = randomBytes(32).toString('hex');
    const requestedAt = new Date();
    const expiresAt = new Date(requestedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    await prisma.marketing_contacts.update({
      where: { id: contact.id },
      data: {
        consentStatus: 'PENDING_CONFIRMATION',
        consentAt: null,
        optInTokenHash: hash(token),
        optInRequestedAt: requestedAt,
        optInExpiresAt: expiresAt,
      },
    });
    const confirmationUrl = `${rootUrl}/api/marketing/confirm?token=${token}`;
    try {
      await transporter.sendMail({
        from: `"Sure Imports" <${process.env.SMTP_EMAIL}>`,
        to: contact.email,
        subject: 'Confirm your Sure Imports email updates',
        html: emailHtml({ firstName: contact.firstName, confirmationUrl }),
      });
      console.log(`Confirmation sent to ${contact.email}`);
    } catch (error) {
      await prisma.marketing_contacts.update({
        where: { id: contact.id },
        data: { optInTokenHash: null, optInRequestedAt: null, optInExpiresAt: null },
      });
      throw error;
    }
  }
  console.log(`Processed ${contacts.length} post-cutover contacts.`);
} finally {
  await prisma.$disconnect();
}
