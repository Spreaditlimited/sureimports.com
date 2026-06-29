const fs = require('fs');
const path = require('path');

const root = process.cwd();
const productDir = path.join(root, 'docs/products/china-supplier-directory-v1');
const suppliers = require(path.join(productDir, 'SUPPLIERS.json'));

const statusLabels = {
  official_site_contact_confirmed:
    'Official site and contact details confirmed',
  official_site_confirmed:
    'Official site confirmed; contact/channel needs final review',
  needs_manual_verification: 'Needs manual verification before publication',
};

const statusOrder = {
  official_site_contact_confirmed: 0,
  official_site_confirmed: 1,
  needs_manual_verification: 2,
};

const grouped = suppliers.reduce((acc, supplier) => {
  acc[supplier.niche] ||= [];
  acc[supplier.niche].push(supplier);
  return acc;
}, {});

const nicheNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

const lines = [];

lines.push('# China Supplier Directory for Nigerian Importers');
lines.push('');
lines.push(
  '## 25 Profitable Niches, Verified Starting Points and Buyer Questions',
);
lines.push('');
lines.push(
  'This is a working manuscript for the paid Sure Imports product. It should not be published until the final verification pass is complete.',
);
lines.push('');
lines.push(
  'Every supplier in this draft is treated as a starting point for buyer research, not as a guaranteed safe supplier. A listed official website does not replace sampling, due diligence, written quotes, product inspection, payment protection and logistics planning.',
);
lines.push('');
lines.push('## How to Use This Directory');
lines.push('');
lines.push(
  '1. Pick one niche that matches your budget, market access and product knowledge.',
);
lines.push(
  "2. Open the supplier's official website and confirm the product category still exists.",
);
lines.push(
  '3. Contact the supplier through the official contact route, not random WhatsApp numbers from marketplaces.',
);
lines.push(
  '4. Ask for model numbers, MOQ, sample price, packaging details, production timeline, warranty terms and export documents.',
);
lines.push(
  '5. Do not pay for a bulk order until you have confirmed product quality, landed cost, shipping route and supplier identity.',
);
lines.push('');
lines.push('## Verification Labels');
lines.push('');
lines.push(
  '- Official site and contact details confirmed: the official website and one or more contact details were found on company-controlled pages.',
);
lines.push(
  '- Official site confirmed; contact/channel needs final review: the official website and product fit were confirmed, but the final buying channel needs deeper review.',
);
lines.push(
  '- Needs manual verification before publication: keep out of the final paid PDF until verified or replace with a stronger supplier.',
);
lines.push('');
lines.push('## Supplier Directory');
lines.push('');

for (const niche of nicheNames) {
  lines.push(`### ${niche}`);
  lines.push('');

  const nicheSuppliers = grouped[niche].sort((a, b) => {
    const statusDiff =
      statusOrder[a.verificationStatus] - statusOrder[b.verificationStatus];
    if (statusDiff !== 0) return statusDiff;
    return a.supplierName.localeCompare(b.supplierName);
  });

  for (const supplier of nicheSuppliers) {
    lines.push(`#### ${supplier.supplierName}`);
    lines.push('');
    lines.push(`- Product fit: ${supplier.productFit}`);
    lines.push(`- Official website: ${supplier.officialWebsite}`);
    if (supplier.officialContactPage)
      lines.push(`- Official contact route: ${supplier.officialContactPage}`);
    if (supplier.email) lines.push(`- Email: ${supplier.email}`);
    if (supplier.phone) lines.push(`- Phone: ${supplier.phone}`);
    if (supplier.whatsapp) lines.push(`- WhatsApp: ${supplier.whatsapp}`);
    if (supplier.address) lines.push(`- Address: ${supplier.address}`);
    lines.push(`- Region: ${supplier.countryRegion}`);
    lines.push(
      `- Verification: ${statusLabels[supplier.verificationStatus] || supplier.verificationStatus}`,
    );
    lines.push(`- Why this matters: ${supplier.verifiedFrom}`);
    lines.push(`- Buyer note: ${supplier.buyerNotes}`);
    lines.push('');
  }
}

lines.push('## Gaps Before Publication');
lines.push('');
lines.push(
  '- Salon and barbershop equipment still needs at least one official-site-confirmed supplier.',
);
lines.push(
  '- Several niches currently have only one supplier lead. That is acceptable for an early internal draft, but the paid PDF should ideally have more depth in the strongest 10 to 15 niches.',
);
lines.push(
  '- Entries marked `needs_manual_verification` should either be verified or removed before publication.',
);
lines.push(
  '- For big brands, the final copy must direct buyers toward authorized distribution and warranty-safe routes, not grey-market buying.',
);
lines.push('');
lines.push('## Sure Imports CTA');
lines.push('');
lines.push(
  'If you want Sure Imports to help you compare suppliers, request quotes, check landed cost and coordinate sourcing, use Corporate Sourcing or LineScout depending on the product type.',
);
lines.push('');
lines.push('- Corporate Sourcing: https://www.sureimports.com/corporate-gifts');
lines.push(
  '- LineScout for machinery/equipment: https://linescout.sureimports.com/',
);
lines.push(
  '- Buy From Chinese Websites for already-found product links: https://www.sureimports.com/buy-from-chinese-websites',
);
lines.push(
  '- Shipping-only requests: https://www.sureimports.com/ship-with-us',
);
lines.push('');

fs.writeFileSync(
  path.join(productDir, 'DIRECTORY_MANUSCRIPT.md'),
  lines.join('\n'),
);
console.log(
  `Generated ${path.join(productDir, 'DIRECTORY_MANUSCRIPT.md')} from ${suppliers.length} supplier records.`,
);
