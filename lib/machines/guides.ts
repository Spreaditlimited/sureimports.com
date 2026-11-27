/** Public directory membership. Series metadata automatically enrolls future guides. */
export const legacyMachineGuides: Record<string, string> = {
  'rice-milling-and-packaging-production-line-nigeria':
    'Machines and production lines',
  'the-plantain-flour-production-process-in-nigeria-why-most-factories-struggle-with-quality':
    'Machines and production lines',
  'cabinet-dryer-vs-tunnel-dryer-for-plantain-flour-the-definitive-engineering-scaling-blueprint':
    'Machines and production lines',
  'how-to-source-packaging-machines-from-china-for-nigerian-smes':
    'Machines and production lines',
  'ice-block-making-machine-price-nigeria': 'Machines and production lines',
  'industrial-sewing-machine-price-nigeria': 'Machines and production lines',
  'flour-milling-machine-nigeria': 'Machines and production lines',
  'palm-oil-processing-machine-nigeria': 'Machines and production lines',
  'machine-sourcing-from-china-for-nigeria-how-to-do-it-without-guessing':
    'Buying, testing and factory setup',
  'the-blueprint-for-industrial-success-how-to-source-agro-processing-machines-from-china-safely':
    'Buying, testing and factory setup',
  'generator-sizing-for-industrial-machines-in-nigeria':
    'Buying, testing and factory setup',
  'the-power-blueprint-the-exhaustive-guide-to-sizing-generators-for-nigerian-factories':
    'Buying, testing and factory setup',
  'china-factory-test-run-for-machines-why-many-suppliers-avoid-it':
    'Buying, testing and factory setup',
  'what-a-real-china-factory-test-run-for-machines-should-look-like':
    'Buying, testing and factory setup',
  'beyond-the-label-the-critical-difference-between-a-machine-name-and-a-machine-specification':
    'Buying, testing and factory setup',
  'the-uncomfortable-truth-why-many-machine-imports-from-china-fail-in-nigeria':
    'Buying, testing and factory setup',
};
export type MachineBlog = {
  blogTitle: string;
  blogSlug: string | null;
  blogExt2: string | null;
  blogPublished: boolean;
  xStaus: string | null;
  createdAt: Date | string | null;
};
export function machineGuideMetadata(
  value: string | null,
): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
export function selectMachineGuides(
  blogs: MachineBlog[],
  now = new Date(),
  redirected: (slug: string) => boolean = () => false,
) {
  const seen = new Set<string>();
  return blogs.flatMap((blog) => {
    const slug = blog.blogSlug?.trim();
    if (
      !slug ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
      !blog.blogPublished ||
      blog.xStaus !== 'active' ||
      redirected(slug)
    )
      return [];
    if (blog.createdAt !== null) {
      const timestamp = new Date(blog.createdAt).getTime();
      if (!Number.isFinite(timestamp) || timestamp > now.getTime()) return [];
    }
    const meta = machineGuideMetadata(blog.blogExt2);
    if (meta.noIndex === true || meta.noFollow === true) return [];
    const series = meta.productionLine;
    const isSeries =
      !!series &&
      typeof series === 'object' &&
      /^PL-\d{3}$/.test(
        String((series as Record<string, unknown>).topicId || ''),
      );
    const group =
      isSeries || meta.machineGuide === true
        ? 'Machines and production lines'
        : legacyMachineGuides[slug];
    if (!group || seen.has(slug)) return [];
    seen.add(slug);
    return [
      {
        slug,
        title: blog.blogTitle,
        group,
        description:
          typeof meta.metaDescription === 'string' ? meta.metaDescription : '',
        isSeries,
      },
    ];
  });
}
