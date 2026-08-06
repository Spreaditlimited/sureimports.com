import { prisma } from '../lib/prisma';
import { REPORT_SEO } from '../lib/intelligence/reportSeo';

const EDITION = 'August 2026';
const PRICE_NAIRA = 25_000;
const PRICE_USD_CENTS = 5_000;

function id(prefix: string) {
  return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 9)
    .toUpperCase()}`;
}

async function main() {
  const slugs = Object.keys(REPORT_SEO);
  if (slugs.length !== 25) {
    throw new Error(`Expected 25 SEO profiles; found ${slugs.length}.`);
  }

  const niches = await prisma.$queryRawUnsafe<
    Array<{ pidNiche: string; name: string; slug: string }>
  >(
    `SELECT pidNiche, name, slug
     FROM intelligence_niches
     WHERE slug IN (${slugs.map(() => '?').join(', ')})
       AND status = 'published'`,
    ...slugs,
  );
  if (niches.length !== 25) {
    const found = new Set(niches.map((niche) => niche.slug));
    throw new Error(
      `Missing report categories: ${slugs.filter((slug) => !found.has(slug)).join(', ')}`,
    );
  }

  const prepared = [];
  for (const niche of niches) {
    const databaseSuppliers = await prisma.$queryRaw<
      Array<{ supplierName: string; officialWebsite: string }>
    >`
      SELECT DISTINCT s.supplierName, s.officialWebsite
      FROM intelligence_suppliers s
      LEFT JOIN intelligence_supplier_categories sc ON sc.supplierId = s.pidSupplier
      LEFT JOIN intelligence_niches primaryNiche ON primaryNiche.pidNiche = s.nicheId
      LEFT JOIN intelligence_niches linkedNiche ON linkedNiche.pidNiche = sc.nicheId
      WHERE s.status = 'published'
        AND s.verificationStatus = 'official_site_contact_confirmed'
        AND s.whatsapp IS NOT NULL
        AND s.whatsapp <> ''
        AND s.lastVerifiedAt IS NOT NULL
        AND (primaryNiche.slug = ${niche.slug} OR linkedNiche.slug = ${niche.slug})
    `;
    const supplierCount = new Set(
      databaseSuppliers.map((supplier) =>
        `${String(supplier.supplierName || '').trim()}|${String(
          supplier.officialWebsite || '',
        )
          .trim()
          .replace(/\/$/, '')}`.toLowerCase(),
      ),
    ).size;
    if (supplierCount < 10) {
      throw new Error(`${niche.name} has only ${supplierCount} verified suppliers.`);
    }

    const seo = REPORT_SEO[niche.slug];
    const title = `${niche.name} Supplier Intelligence Report`;
    const existing = await prisma.intelligence_report_products.findFirst({
      where: { OR: [{ nicheId: niche.pidNiche }, { slug: niche.slug }] },
    });
    const common = {
      nicheId: niche.pidNiche,
      slug: niche.slug,
      title,
      subtitle: seo.metaDescription,
      description: `${seo.introduction} ${seo.buyerValue}`,
      editionLabel: EDITION,
      coverImageUrl: `/assets/images/intelligence-covers/${niche.slug}-v1.png`,
      priceNaira: PRICE_NAIRA,
      priceUsdCents: PRICE_USD_CENTS,
      supplierCount,
      updatedAt: new Date(),
    };

    const report = existing
      ? await prisma.intelligence_report_products.update({
          where: { pidReport: existing.pidReport },
          data: common,
        })
      : await prisma.intelligence_report_products.create({
          data: {
            pidReport: id('SIR'),
            ...common,
            status: 'draft',
            createdAt: new Date(),
          },
        });
    prepared.push({
      pidReport: report.pidReport,
      slug: report.slug,
      supplierCount: report.supplierCount,
      priceNaira: report.priceNaira,
      priceUsdCents: report.priceUsdCents,
    });
  }

  prepared.sort((a, b) => a.slug.localeCompare(b.slug));
  console.log(JSON.stringify({ prepared: prepared.length, reports: prepared }, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
