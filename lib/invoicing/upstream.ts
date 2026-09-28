export function getAdminInvoicingBaseUrl(
  requestUrl: string,
  configured = process.env.ADMIN_INVOICING_API_BASE_URL,
) {
  const upstream = new URL(configured || 'https://admin.sureimports.com');
  const current = new URL(requestUrl);
  const normalizeHost = (host: string) =>
    ['localhost', '127.0.0.1', '[::1]'].includes(host) ? 'localhost' : host;
  if (
    !['http:', 'https:'].includes(upstream.protocol) ||
    (normalizeHost(upstream.hostname) === normalizeHost(current.hostname) &&
      upstream.port === current.port)
  ) {
    throw new Error(
      'Invoice service configuration points to the customer website. ADMIN_INVOICING_API_BASE_URL must point to the admin application.',
    );
  }
  return upstream.toString().replace(/\/$/, '');
}
