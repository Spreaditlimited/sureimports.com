import xMail from '@/lib/email/xMail';
import { prisma } from '@/lib/prisma';

type NotifyNewShippingOnlyRequestInput = {
  pidShippingOnly: string;
  customerName: string;
  customerEmail: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  shippingPlan: string;
  grossWeight: string;
  trackingNumber?: string;
  expectedShipments?: string;
  description: string;
};

const resolveAdminEmail = () =>
  process.env.SHIPPING_ONLY_ADMIN_EMAIL ||
  process.env.NOTIFICATIONS_ADMIN_EMAIL ||
  'hello@sureimports.com';

const dashboardLink = 'https://sureimports.com/dashboard/shipping-only';

function readableFallback(value: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return '-';
  return raw
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function resolveCountryName(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return '-';

  const country = await prisma.country.findFirst({
    where: {
      OR: [
        { pidCountry: raw },
        { countrySlug: raw },
        { countryName: raw },
      ],
    },
    select: { countryName: true },
  });

  return country?.countryName || readableFallback(raw);
}

async function resolveShippingPlanName(value: string) {
  const raw = String(value || '').trim();
  if (!raw) return '-';

  const plan = await prisma.shippingplan.findFirst({
    where: {
      OR: [
        { pidShippingPlan: raw },
        { shippingPlanSlug: raw },
        { shippingPlanName: raw },
      ],
    },
    select: { shippingPlanName: true },
  });

  return plan?.shippingPlanName ? readableFallback(plan.shippingPlanName) : readableFallback(raw);
}

export async function notifyNewShippingOnlyRequest(
  input: NotifyNewShippingOnlyRequestInput,
) {
  const [shippingToName, shippingPlanName] = await Promise.all([
    resolveCountryName(input.shippingTo),
    resolveShippingPlanName(input.shippingPlan),
  ]);

  const detailsTable = `
<table style="width:100%;border-collapse:collapse;margin-top:6px;border:1px solid #e5e7eb;">
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Request ID</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.pidShippingOnly}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Customer Name</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.customerName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Customer Email</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.customerEmail}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>WhatsApp Number</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.whatsappNumber || '-'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Shipment Name</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.shippingName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Destination</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${shippingToName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Shipping Plan</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${shippingPlanName}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Gross Weight</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.grossWeight}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Tracking Number</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.trackingNumber || '-'}</td></tr>
  <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f8fafc;"><b>Expected Shipments</b></td><td style="padding:8px;border:1px solid #e5e7eb;">${input.expectedShipments || '-'}</td></tr>
</table>
<p style="margin-top:10px;"><b>Description</b><br />${input.description}</p>`;

  const adminEmail = resolveAdminEmail();

  const customerMail = xMail({
    xEmail: input.customerEmail,
    xTitle: `Shipping Request Received - ${input.pidShippingOnly}`,
    xBodyTitle: 'Shipping Request Confirmation',
    xBody1: `Hello ${input.customerName || 'Customer'},<br />Your shipping-only request has been received successfully.`,
    xBody2: `${detailsTable}<br /><br />You can track updates from your dashboard.`,
    xButtonTitle: 'Open Shipping Dashboard',
    xButtonLink: dashboardLink,
  });

  const adminMail = xMail({
    xEmail: adminEmail,
    xTitle: `New Shipping-Only Request - ${input.pidShippingOnly}`,
    xBodyTitle: 'New Shipping-Only Request',
    xBody1: 'A new shipping-only request has been submitted.',
    xBody2: detailsTable,
    xButtonTitle: 'Open Admin Dashboard',
    xButtonLink: 'https://admin.sureimports.com/',
  });

  const [customerResult, adminResult] = await Promise.allSettled([
    customerMail,
    adminMail,
  ]);

  return {
    customerEmailTriggered: customerResult.status === 'fulfilled',
    adminEmailTriggered: adminResult.status === 'fulfilled',
    customerEmailError:
      customerResult.status === 'rejected'
        ? String(customerResult.reason)
        : null,
    adminEmailError:
      adminResult.status === 'rejected' ? String(adminResult.reason) : null,
  };
}
