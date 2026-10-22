import { WEBINAR_COOKIE, WEBINAR_VIDEO_ID } from './content';
// Unique one-second intervals, not the furthest seek position, count as viewing.
export function recordWatchedInterval(
  bins: Set<number>,
  previous: number,
  current: number,
  elapsed: number,
) {
  if (
    current <= previous ||
    elapsed <= 0 ||
    current - previous > elapsed * 2.1 + 1
  )
    return;
  for (let b = Math.floor(previous); b + 1 <= current; b++) bins.add(b);
}
let lastSync = 0;
export function persistWebinarProgress(
  videoId: string,
  bins: Set<number>,
  duration: number,
) {
  if (
    videoId !== WEBINAR_VIDEO_ID ||
    !Number.isFinite(duration) ||
    duration < 30
  )
    return;
  const watched = bins.size >= duration * 0.75;
  try {
    localStorage.setItem(`si:webinar:${videoId}`, JSON.stringify([...bins]));
  } catch {
    /* Private browsing. */
  }
  if (!watched) return;
  document.cookie = `${WEBINAR_COOKIE}=${videoId}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  if (Date.now() - lastSync < 60000) return;
  lastSync = Date.now();
  void fetch('/api/webinar/progress', { method: 'POST' }).catch(() => {});
}
