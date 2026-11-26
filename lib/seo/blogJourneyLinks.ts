export type BlogJourneyLink = {
  href: string;
  label: string;
  description: string;
};

const journeyLinks: Record<string, readonly BlogJourneyLink[]> = {
  'import-from-china-to-nigeria-practical-2026-pillar-guide': [
    {
      href: '/import-from-china-to-nigeria',
      label: 'Choose your import route',
      description: 'Match your order to buying, sourcing, supplier payment or shipping support.',
    },
  ],
  'how-to-import-from-china-to-nigeria-in-2026-the-complete-beginner-to-pro-guide': [
    {
      href: '/import-from-china-to-nigeria',
      label: 'Choose your import route',
      description: 'See the Sure Imports options once you know what stage your order has reached.',
    },
  ],
  'china-procurement-agent-for-nigerian-importers-what-we-do-and-how-it-works-2026-guide': [
    {
      href: '/china-sourcing-agent-nigeria',
      label: 'Explore sourcing support',
      description: 'Start with a supplier brief for wholesale, custom products or machinery.',
    },
  ],
  'how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026': [
    {
      href: '/china-supplier-payment-service-nigeria',
      label: 'Have a supplier and invoice?',
      description: 'See the Pay Supplier route and what to prepare for a defined order.',
    },
  ],
  'how-nigerian-importers-should-pay-chinese-suppliers-in-rmb-without-losing-control': [
    {
      href: '/blog/how-to-pay-chinese-suppliers-from-nigeria-safely-in-2026',
      label: 'Compare payment methods',
      description: 'Read the broader guide to supplier payment options and safety checks.',
    },
    {
      href: '/china-supplier-payment-service-nigeria',
      label: 'Ready with a supplier and invoice?',
      description: 'Check the Sure Imports Pay Supplier route for a defined purchase.',
    },
  ],
  'china-to-nigeria-shipping-customs-and-landed-cost-pillar-guide': [
    {
      href: '/tools/cbm-volumetric-weight-calculator',
      label: 'Measure your packed cargo',
      description: 'Calculate carton CBM and estimated air volumetric weight before requesting a quote.',
    },
  ],
};

export function getBlogJourneyLinks(slug: string): readonly BlogJourneyLink[] {
  return journeyLinks[slug] || [];
}
