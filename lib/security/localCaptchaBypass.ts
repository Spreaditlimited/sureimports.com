/** Local addresses only; a production build must never trust a Host-based bypass. */
export function shouldBypassLocalCaptcha(hostname: string): boolean {
  if (process.env.NODE_ENV !== 'development') return false;
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1') return true;
  const parts = host.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return false;
  const [first, second] = parts.map(Number);
  return first === 127 || first === 10 ||
    (first === 192 && second === 168) ||
    (first === 172 && second >= 16 && second <= 31);
}
