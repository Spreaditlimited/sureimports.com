const SITE_URL = 'https://www.sureimports.com';
const FALLBACK_IMAGE = `${SITE_URL}/images/sure-imports-social-card.png`;

/** Resolve the same stored image formats for article, social and schema images. */
export function resolveBlogMediaUrl(
  value?: string | null,
  fallback = FALLBACK_IMAGE,
): string {
  const image = String(value || '').trim();
  if (!image) return fallback;
  if (/^https?:\/\//i.test(image)) {
    try {
      const url = new URL(image);
      // Recover the historical concatenation bug without accepting its fake host.
      if (url.hostname === 'www.sureimports.comadmin-sureimports') {
        return resolveBlogMediaUrl(
          `admin-sureimports${url.pathname}`,
          fallback,
        );
      }
      return url.href;
    } catch {
      return fallback;
    }
  }
  if (image.startsWith('/') && !image.startsWith('//'))
    return `${SITE_URL}${image}`;
  if (image.startsWith('//') || image.includes(':')) return fallback;
  const base = (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '').replace(
    /\/+$/,
    '',
  );
  const publicId = image.startsWith('BLOG_')
    ? `admin-sureimports/blog/${image}`
    : image;
  return base ? `${base}/${publicId}` : fallback;
}
