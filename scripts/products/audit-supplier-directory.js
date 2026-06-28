const suppliers = require("../../docs/products/china-supplier-directory-v1/SUPPLIERS.json");

const minimumPerNiche = 3;
const strongStatuses = new Set(["official_site_contact_confirmed"]);

const grouped = suppliers.reduce((acc, supplier) => {
  acc[supplier.niche] ||= [];
  acc[supplier.niche].push(supplier);
  return acc;
}, {});

const rows = Object.entries(grouped)
  .map(([niche, records]) => {
    const strong = records.filter((record) => strongStatuses.has(record.verificationStatus));
    return {
      niche,
      total: records.length,
      verifiedContacts: strong.length,
      gap: Math.max(0, minimumPerNiche - strong.length),
      status: strong.length >= minimumPerNiche ? "PASS" : "FAIL",
    };
  })
  .sort((a, b) => {
    if (a.status !== b.status) return a.status === "FAIL" ? -1 : 1;
    return b.gap - a.gap || a.niche.localeCompare(b.niche);
  });

console.table(rows);

const failed = rows.filter((row) => row.status === "FAIL");
console.log(
  `\n${rows.length - failed.length}/${rows.length} niches pass. ${failed.length} niches need more verified-contact suppliers or replacement.`,
);

if (failed.length > 0) process.exitCode = 1;
