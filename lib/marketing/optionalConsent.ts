export function hasOptionalCookieConsent(
  cookie = typeof document === 'undefined' ? '' : document.cookie,
) {
  return cookie.split(';').some((value) => value.trim() === 'consent=true');
}
