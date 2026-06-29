import supplierResearch from '@/docs/products/china-supplier-directory-v1/SUPPLIERS.json';
import { prisma } from '@/lib/prisma';

export type SupplierResearchRecord = (typeof supplierResearch)[number];
export type SupplierResearchRecordWithProducts = SupplierResearchRecord & {
  productsMade?: string | string[] | null;
};

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

async function getPublishedDatabaseSuppliers() {
  try {
    const rows = await prisma.$queryRaw<SupplierResearchRecordWithProducts[]>`
      SELECT
        n.name AS niche,
        s.supplierName,
        s.productFit,
        s.productsMade,
        s.officialWebsite,
        s.officialContactPage,
        COALESCE(s.email, '') AS email,
        COALESCE(s.phone, '') AS phone,
        COALESCE(s.whatsapp, '') AS whatsapp,
        COALESCE(s.address, '') AS address,
        COALESCE(s.countryRegion, '') AS countryRegion,
        s.sourceType,
        s.verifiedFrom,
        s.buyerNotes,
        s.verificationStatus
      FROM intelligence_suppliers s
      INNER JOIN intelligence_niches n ON n.pidNiche = s.nicheId
      WHERE s.status = 'published'
        AND n.status = 'published'
      UNION
      SELECT
        n.name AS niche,
        s.supplierName,
        s.productFit,
        s.productsMade,
        s.officialWebsite,
        s.officialContactPage,
        COALESCE(s.email, '') AS email,
        COALESCE(s.phone, '') AS phone,
        COALESCE(s.whatsapp, '') AS whatsapp,
        COALESCE(s.address, '') AS address,
        COALESCE(s.countryRegion, '') AS countryRegion,
        s.sourceType,
        s.verifiedFrom,
        s.buyerNotes,
        s.verificationStatus
      FROM intelligence_supplier_categories sc
      INNER JOIN intelligence_suppliers s ON s.pidSupplier = sc.supplierId
      INNER JOIN intelligence_niches n ON n.pidNiche = sc.nicheId
      WHERE s.status = 'published'
        AND n.status = 'published'
    `;

    return rows;
  } catch {
    return [];
  }
}

export async function getResearchSuppliersWithDb() {
  const baseSuppliers = getResearchSuppliers();
  const dbSuppliers = await getPublishedDatabaseSuppliers();
  const seen = new Set<string>();

  return [...baseSuppliers, ...dbSuppliers].filter((supplier) => {
    const key = `${supplier.niche}|${supplier.supplierName}|${supplier.officialWebsite}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

export async function getPassingNichesWithDb(minimumVerifiedContacts = 3) {
  const grouped = new Map<string, SupplierResearchRecord[]>();

  for (const supplier of await getResearchSuppliersWithDb()) {
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

export async function getNicheBySlugWithDb(slug: string) {
  return (await getPassingNichesWithDb()).find((niche) => niche.slug === slug) || null;
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
    supplier.countryRegion
      ? `Supplier location: ${supplier.countryRegion}.`
      : '',
    'Before paying, confirm current pricing, MOQ, sample terms, warranty route, invoice recipient and shipping requirements.',
  ]
    .filter(Boolean)
    .join(' ');
}
