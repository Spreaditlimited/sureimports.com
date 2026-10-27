export type BlogListingParams = {
  tag?: string | string[];
  category?: string | string[];
  page?: string | string[];
  q?: string | string[];
  sort?: string | string[];
};

const single = (value: string | string[] | undefined) =>
  (typeof value === 'string' ? value : value?.[0] || '').trim();

export function parseBlogListingParams(params: BlogListingParams) {
  const pageValue = single(params.page);
  const parsed = /^\d+$/.test(pageValue) ? Number(pageValue) : 1;
  return {
    page: Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1,
    q: single(params.q).slice(0, 200),
    tag: single(params.tag).slice(0, 120),
    category:
      single(params.category).toLowerCase() === 'all'
        ? ''
        : single(params.category).slice(0, 120),
    sort:
      single(params.sort) === 'oldest'
        ? ('oldest' as const)
        : ('newest' as const),
  };
}

export function blogListingHref(
  params: ReturnType<typeof parseBlogListingParams>,
) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.tag) query.set('tag', params.tag);
  if (params.category) query.set('category', params.category);
  if (params.sort !== 'newest') query.set('sort', params.sort);
  if (params.page > 1) query.set('page', String(params.page));
  return `/blog${query.size ? `?${query}` : ''}`;
}
