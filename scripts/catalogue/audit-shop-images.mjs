import fs from 'node:fs/promises';
const base = process.env.SHOP_TEST_URL || 'http://localhost:3001';
const products = [];
let pages = 1;
for (let page = 1; page <= pages; page++) {
  const response = await fetch(
    `${base}/api/shop/products?page=${page}&limit=100`,
  );
  if (!response.ok) throw Error(`Shop API returned ${response.status}`);
  const { data } = await response.json();
  products.push(...data.products);
  pages = data.pagination.totalPages;
}
const resolveImage = (value) =>
  /^https?:\/\//.test(value)
    ? value
    : value.startsWith('/')
      ? `${base}${value}`
      : `${(process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '').replace(/\/$/, '')}/${value}`;
const urls = [
  ...new Set(
    products
      .map((p) => p.productImage)
      .filter(Boolean)
      .map(resolveImage),
  ),
];
const results = [];
let next = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(20000),
        });
        results.push({
          url,
          ok:
            response.ok &&
            response.headers.get('content-type')?.startsWith('image/'),
          status: response.status,
        });
      } catch (error) {
        results.push({ url, ok: false, error: error.message });
      }
    }
  }),
);
const failures = results.filter((r) => !r.ok);
const report = {
  products: products.length,
  uniqueImages: urls.length,
  missing: products
    .filter((p) => !p.productImage)
    .map((p) => ({ id: p.pidProduct, name: p.productName })),
  failures,
};
await fs.mkdir('.catalogue-backups', { recursive: true });
await fs.writeFile(
  '.catalogue-backups/shop-image-audit.json',
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (failures.length || report.missing.length) process.exitCode = 1;
