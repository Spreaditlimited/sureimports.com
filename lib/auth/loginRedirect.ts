export const DEFAULT_LOGIN_REDIRECT = '/dashboard/procurement';
export const POST_AUTH_REDIRECT_KEY = 'sureimports:postAuthRedirect';
export const POST_LOGOUT_REDIRECT_KEY = 'sureimports:postLogoutRedirect';
export const PENDING_PROCUREMENT_CHECKOUT_KEY =
  'sureimports:pendingProcurementCheckout';
export const PROCUREMENT_RESUME_CHECKOUT_PATH = '/checkout/resume-procurement';
export const CORPORATE_SOURCING_RESUME_PATH =
  '/checkout/resume-corporate-sourcing';
export const PENDING_SHIPPING_ONLY_CHECKOUT_KEY =
  'sureimports:pendingShippingOnlyCheckout';
export const SHIPPING_ONLY_RESUME_PATH = '/checkout/resume-shipping-only';
export const SUPPLIER_INTELLIGENCE_PATH = '/supplier-intelligence';

export function getSupplierReportResumePath(reportSlug: string) {
  return `${SUPPLIER_INTELLIGENCE_PATH}/reports/${encodeURIComponent(reportSlug)}?resumeCheckout=1`;
}

export function getIntelligenceSubscriptionResumePath(plan: string) {
  const safePlan = plan === 'pro' ? 'pro' : 'starter';
  return `${SUPPLIER_INTELLIGENCE_PATH}?resumeSubscription=${safePlan}`;
}

export function getSafeLoginRedirect(redirectCandidate: string | null): string {
  if (!redirectCandidate) return DEFAULT_LOGIN_REDIRECT;
  if (
    !redirectCandidate.startsWith('/') ||
    redirectCandidate.startsWith('//') ||
    redirectCandidate.startsWith('/auth/')
  ) {
    return DEFAULT_LOGIN_REDIRECT;
  }

  try {
    const url = new URL(redirectCandidate, 'https://sureimports.local');
    const isDashboardPath = url.pathname.startsWith('/dashboard');
    const isShopCheckoutResume =
      url.pathname === '/shop/checkout' &&
      url.searchParams.get('resumeCheckout') === '1';
    const isProcurementCheckoutResume =
      url.pathname === PROCUREMENT_RESUME_CHECKOUT_PATH;
    const isCorporateSourcingResume =
      url.pathname === CORPORATE_SOURCING_RESUME_PATH;
    const isShippingCheckoutResume = url.pathname === SHIPPING_ONLY_RESUME_PATH;
    const isIntelligencePath = url.pathname.startsWith('/intelligence');
    const isSupplierReportCheckoutResume =
      /^\/supplier-intelligence\/reports\/[^/]+$/.test(url.pathname) &&
      url.searchParams.get('resumeCheckout') === '1';
    const isSupplierSubscriptionResume =
      url.pathname === SUPPLIER_INTELLIGENCE_PATH &&
      ['starter', 'pro'].includes(
        url.searchParams.get('resumeSubscription') || '',
      );

    if (
      isDashboardPath ||
      isShopCheckoutResume ||
      isProcurementCheckoutResume ||
      isCorporateSourcingResume ||
      isShippingCheckoutResume ||
      isIntelligencePath ||
      isSupplierReportCheckoutResume ||
      isSupplierSubscriptionResume
    ) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return DEFAULT_LOGIN_REDIRECT;
  }

  return DEFAULT_LOGIN_REDIRECT;
}
