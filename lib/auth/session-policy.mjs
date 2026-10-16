export const REMEMBER_SECONDS = 30 * 24 * 60 * 60;
// Only an explicit boolean opt-in creates a persistent browser cookie.
export function sessionCookieLifetime(rememberMe) {
  return rememberMe === true ? { maxAge: REMEMBER_SECONDS } : {};
}
