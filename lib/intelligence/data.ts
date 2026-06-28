import supplierResearch from '@/docs/products/china-supplier-directory-v1/SUPPLIERS.json';

export type SupplierResearchRecord = (typeof supplierResearch)[number];

export function slugifyNiche(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getResearchSuppliers() {
  return supplierResearch as SupplierResearchRecord[];
}

export function getPassingNiches(minimumVerifiedContacts = 3) {
  const grouped = new Map<string, SupplierResearchRecord[]>();

  for (const supplier of getResearchSuppliers()) {
    if (supplier.verificationStatus !== 'official_site_contact_confirmed') {
      continue;
    }

    const current = grouped.get(supplier.niche) || [];
    current.push(supplier);
    grouped.set(supplier.niche, current);
  }

  return Array.from(grouped.entries())
    .filter(([, suppliers]) => suppliers.length >= minimumVerifiedContacts)
    .map(([name, suppliers]) => ({
      name,
      slug: slugifyNiche(name),
      suppliers: suppliers.sort((a, b) =>
        a.supplierName.localeCompare(b.supplierName),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getNicheBySlug(slug: string) {
  return getPassingNiches().find((niche) => niche.slug === slug) || null;
}

export function getSupplierCheckSummary(supplier: SupplierResearchRecord) {
  const contactSignals = [
    supplier.email ? 'email' : '',
    supplier.phone ? 'phone' : '',
    supplier.whatsapp ? 'WhatsApp' : '',
    supplier.officialContactPage ? 'contact route' : '',
    supplier.address ? 'business address' : '',
  ].filter(Boolean);

  const contactText =
    contactSignals.length > 0
      ? `We have a usable ${contactSignals.join(', ')} for follow-up.`
      : 'A direct buying channel should be confirmed before outreach.';

  return [
    `${supplier.supplierName} is a Sure Imports checked lead for ${supplier.niche}.`,
    `Our checks support its fit for ${supplier.productFit}.`,
    contactText,
    supplier.countryRegion ? `Supplier location: ${supplier.countryRegion}.` : '',
    'Before paying, confirm current pricing, MOQ, sample terms, warranty route, invoice recipient and shipping requirements.',
  ]
    .filter(Boolean)
    .join(' ');
}
