import xMail from '@/lib/email/xMail';

const orderHelpUrl = `${(process.env.ROOT_URL || 'https://www.sureimports.com').replace(/\/$/, '')}/dashboard/procurement/view-orders/saved`;

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function greetingName(value?: string | null) {
  return escapeHtml(value?.trim() || 'there');
}

function authorizationSummary(orderCount: number, canCreateOrder: boolean) {
  const savedOrders = orderCount
    ? `help with ${orderCount} saved ${orderCount === 1 ? 'order' : 'orders'}`
    : '';
  const createOrder = canCreateOrder ? 'create a saved order for you' : '';
  return [savedOrders, createOrder].filter(Boolean).join(' and ');
}

export function buildAssistanceAuthorizedEmail(input: {
  firstName?: string | null;
  expiresAt: Date;
  orderCount: number;
  canCreateOrder: boolean;
}) {
  const approved = authorizationSummary(input.orderCount, input.canCreateOrder);
  const expiry = input.expiresAt.toLocaleDateString('en-GB', {
    dateStyle: 'long',
    timeZone: 'Africa/Lagos',
  });
  return {
    subject: 'Your Sure Imports order help request is active',
    heading: 'You have given us access to help',
    body1: `Hi ${greetingName(input.firstName)},<br /><br />You have given the Sure Imports admin team permission to help with your order.<br /><br /><strong>What you approved:</strong> ${escapeHtml(approved)}.`,
    body2: `This access will end on ${escapeHtml(expiry)}. You can remove it at any time from your Saved Orders page.<br /><br />For your protection, our admin cannot make payments, use your wallet, change your password, or update your profile.`,
    buttonTitle: 'View Order Help',
  };
}

export function buildAssistanceRevokedEmail(input: {
  firstName?: string | null;
}) {
  return {
    subject: 'You removed admin access to your order',
    heading: 'Admin access has been removed',
    body1: `Hi ${greetingName(input.firstName)},<br /><br />You have removed Sure Imports admin access to your order help request.`,
    body2:
      'Our admin can no longer create or change any order covered by this request.<br /><br />If you still need help, you can start another request from your Saved Orders page.',
    buttonTitle: 'View Saved Orders',
  };
}

async function sendOrderHelpEmail(
  email: string,
  content: ReturnType<
    typeof buildAssistanceAuthorizedEmail | typeof buildAssistanceRevokedEmail
  >,
) {
  try {
    await xMail({
      xEmail: email,
      xTitle: content.subject,
      xBodyTitle: content.heading,
      xBody1: content.body1,
      xBody2: content.body2,
      xButtonTitle: content.buttonTitle,
      xButtonLink: orderHelpUrl,
    });
  } catch (error) {
    console.error('Failed to send procurement assistance email:', error);
  }
}

export async function sendAssistanceAuthorizedEmail(input: {
  email: string;
  firstName?: string | null;
  expiresAt: Date;
  orderCount: number;
  canCreateOrder: boolean;
}) {
  return sendOrderHelpEmail(input.email, buildAssistanceAuthorizedEmail(input));
}

export async function sendAssistanceRevokedEmail(input: {
  email: string;
  firstName?: string | null;
}) {
  return sendOrderHelpEmail(input.email, buildAssistanceRevokedEmail(input));
}
