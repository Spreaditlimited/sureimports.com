const BLOG_REDIRECTS: Record<string, string> = {
  'build-your-empire-the-ultimate-guide-to-white-labeling-products-from-china-for-the-nigerian-market':
    '/blog/how-to-build-your-own-white-label-products-in-china-for-the-nigerian-market',
};

export function getBlogRedirectTarget(slug: string) {
  return BLOG_REDIRECTS[String(slug || '').trim().toLowerCase()] || null;
}

export function isRedirectedBlogSlug(slug: string | null | undefined) {
  return Boolean(slug && getBlogRedirectTarget(slug));
}
