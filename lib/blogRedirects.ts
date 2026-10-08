const BLOG_REDIRECTS: Record<string, string> = {
  'how-to-order-from-china-to-nigeria-in-2026-the-complete-beginner-to-pro-guide':
    '/blog/how-to-import-from-china-to-nigeria-in-2026-the-complete-beginner-to-pro-guide',
  'build-your-empire-the-ultimate-guide-to-white-labeling-products-from-china-for-the-nigerian-market':
    '/blog/how-to-build-your-own-white-label-products-in-china-for-the-nigerian-market',
};

export function getBlogRedirectTarget(slug: string) {
  return BLOG_REDIRECTS[String(slug || '').trim().toLowerCase()] || null;
}

export function isRedirectedBlogSlug(slug: string | null | undefined) {
  return Boolean(slug && getBlogRedirectTarget(slug));
}
