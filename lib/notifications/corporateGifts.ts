import xMail from '@/lib/email/xMail2';

export const CORPORATE_GIFT_STATUSES = [
  'Pending',
  'Sourced',
  'Invoiced',
  'Production Started',
  'Ready for Shipping',
  'Shipped',
  'Arrived',
  'Delivered',
] as const;

export type CorporateGiftStatus = (typeof CORPORATE_GIFT_STATUSES)[number];

type NotifyInput = {
  requestId: string;
  businessName: string;
  contactPersonFullName: string;
  contactEmail: string;
  whatsappNumber: string;
  status: CorporateGiftStatus;
  handledByName?: string | null;
  onboarding?: {
    accountCreated: boolean;
    temporaryPassword?: string;
    dashboardLink?: string;
  };
};

async function sendWhatsAppTemplate(input: NotifyInput) {
  const webhookUrl = process.env.N8N_WHATSAPP_WEBHOOK_URL;
  const webhookToken = process.env.N8N_WHATSAPP_WEBHOOK_TOKEN;

  if (!webhookUrl) {
    console.warn('n8n WhatsApp webhook is not configured');
    return;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
    },
    body: JSON.stringify({
      channel: 'whatsapp',
      useTemplate: true,
      templateKey: 'corporate_gift_status_update',
      requestId: input.requestId,
      businessName: input.businessName,
      contactPersonFullName: input.contactPersonFullName,
      contactEmail: input.contactEmail,
      whatsappNumber: input.whatsappNumber,
      status: input.status,
      handledByName: input.handledByName || '',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `n8n WhatsApp webhook error (${response.status}): ${errorText}`,
    );
  }
}

export async function notifyCustomerCorporateGiftStatus(input: NotifyInput) {
  const statusLine = `Current Status: ${input.status}`;
  const dashboardLink =
    input.onboarding?.dashboardLink ||
    'https://sureimports.com/dashboard/corporate-gifts';

  const emailBody = `
<table style="width:100%;border-collapse:collapse;margin-top:6px;border:1px solid #e5e7eb;">
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Request ID</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.requestId}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Business</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.businessName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Current Status</b></td><td style="padding:8px;border:1px solid #e5e7eb;"><b>${statusLine}</b></td></tr>
</table>`;

  const onboardingBlock = input.onboarding?.accountCreated
    ? `<br /><br /><b>Your SureImports dashboard account has been created automatically.</b><br />
Email: ${input.contactEmail}<br />
Temporary single-use password: <b>${input.onboarding.temporaryPassword || ''}</b><br />
After your first login, this temporary password expires and you will be prompted to reset it.`
    : '';

  const [emailResult, whatsappResult] = await Promise.allSettled([
    xMail({
      xEmail: input.contactEmail,
      xTitle: `Corporate Gift Request Update - ${input.requestId} (${input.status})`,
      xBodyTitle: 'Corporate Gift Status Update',
      xBody1: `Hello ${input.contactPersonFullName || 'Customer'},<br />We have an update on your corporate gift sourcing request.`,
      xBody2: `${emailBody}${onboardingBlock}<br /><br />Thank you for choosing Sure Imports.`,
      xButtonTitle: 'Open Corporate Gifts Dashboard',
      xButtonLink: dashboardLink,
    }),
    sendWhatsAppTemplate(input),
  ]);

  return {
    emailTriggered: emailResult.status === 'fulfilled',
    whatsappTriggered: whatsappResult.status === 'fulfilled',
    emailError:
      emailResult.status === 'rejected' ? String(emailResult.reason) : null,
    whatsappError:
      whatsappResult.status === 'rejected'
        ? String(whatsappResult.reason)
        : null,
  };
}
