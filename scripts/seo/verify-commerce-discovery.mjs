import fs from 'node:fs';
const origin = (process.argv[2] || 'https://www.sureimports.com').replace(/\/$/, '');
const output = process.argv[3];
const canonicalOrigin = 'https://www.sureimports.com';
const request = async (path, options = {}) => {
  const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(30000), ...options });
  return { status: response.status, html: await response.text() };
};
const data = JSON.parse((await request('/api/shop/products?limit=200')).html).data;
if (data.pagination.totalCount > data.products.length) throw new Error('Increase catalogue retrieval before auditing all products.');
const products = data.products;
const sitemap = (await request('/sitemap.xml')).html;
const models = [...sitemap.matchAll(/<loc>[^<]*\/cars\/models\/([^<]+)<\/loc>/g)].map((m) => m[1]);
const failures = [];
const pages = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
function metadata(html) {
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try { const d = JSON.parse(m[1]); return Array.isArray(d) ? d : d['@graph'] || [d]; }
    catch { failures.push('Invalid JSON-LD'); return []; }
  });
  return { canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&'), h1Count: (html.match(/<h1\b/g) || []).length, schemas, robots: html.match(/<meta name="robots" content="([^"]+)"/)?.[1] };
}
const tasks = [
  ...products.map((product) => ({ path: `/shop/${encodeURIComponent(product.pidProduct)}`, product })),
  ...models.map((slug) => ({ path: `/cars/models/${slug}` })),
];
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < tasks.length) {
    const { path, product } = tasks[cursor++];
    try {
      const { status, html } = await request(path);
      const meta = metadata(html);
      check(status === 200, `${path}: HTTP ${status}`);
      check(meta.canonical === `${canonicalOrigin}${path}`, `${path}: wrong canonical ${meta.canonical}`);
      check(meta.h1Count === 1, `${path}: ${meta.h1Count} main headings`);
      check(!meta.robots?.includes('noindex'), `${path}: noindex`);
      check(sitemap.includes(`${canonicalOrigin}${path}</loc>`), `${path}: absent from sitemap`);
      const breadcrumb = meta.schemas.find((s) => s['@type'] === 'BreadcrumbList');
      check(breadcrumb?.itemListElement?.length >= 3, `${path}: missing breadcrumbs`);
      if (product) {
        const schema = meta.schemas.find((s) => s['@type'] === 'Product');
        if (product.productPrice > 0 && product.productImage) {
          check(Boolean(schema), `${path}: missing Product`);
          check(schema?.offers?.price === product.productPrice, `${path}: price differs from catalogue`);
          check(schema?.offers?.priceCurrency === 'NGN', `${path}: wrong currency`);
          check(schema?.sku === product.pidProduct, `${path}: wrong SKU`);
          if (!product.productStatus) check(!schema?.offers?.availability, `${path}: invented stock`);
        }
        check(!html.includes('affiliatePayout'), `${path}: internal merchandising data in page`);
      }
      pages.push({ path, status, canonical: meta.canonical, h1Count: meta.h1Count, schemaTypes: meta.schemas.map((s) => s['@type']) });
    } catch (error) { failures.push(`${path}: ${error.message}`); }
  }
}));
const listingIds = new Set();
for (let page = 1; page <= Math.ceil(products.length / 24); page++) {
  const path = `/shop${page > 1 ? `?page=${page}` : ''}`;
  const { html, status } = await request(path);
  const meta = metadata(html);
  check(status === 200 && meta.canonical === canonicalOrigin + path, `${path}: listing response/canonical`);
  const collection = meta.schemas.find((s) => s['@type'] === 'CollectionPage');
  const items = collection?.mainEntity?.itemListElement || [];
  check(items.length > 0, `${path}: empty collection`);
  for (const item of items) {
    const id = item.url.split('/').at(-1);
    check(!listingIds.has(id), `${path}: duplicate across pages ${id}`);
    listingIds.add(id);
    check(html.includes(`href="/shop/${id}"`), `${path}: product lacks anchor ${id}`);
  }
  if (page < Math.ceil(products.length / 24)) check(html.includes(`href="/shop?page=${page + 1}#shop-products"`), `${path}: missing next-page link`);
}
check(listingIds.size === products.length, `Only ${listingIds.size}/${products.length} products reachable through pages`);
for (const path of ['/shop/category/phones', '/shop/category/laptops', '/shop/category/watches']) {
  const { html, status } = await request(path); const m = metadata(html);
  check(status === 200 && m.canonical === canonicalOrigin + path && !m.robots?.includes('noindex'), `${path}: category discovery`);
}
for (const path of ['/shop/not-a-real-product', '/shop?page=99999', '/shop/category/not-real']) {
  check((await request(path)).status === 404, `${path}: needs true 404`);
}
for (const path of ['/shop?q=S25', '/cars?q=BYD', '/shop/checkout', '/shop/order-success']) {
  const { html } = await request(path); check(metadata(html).robots?.includes('noindex'), `${path}: must be noindex`);
}
const robots = (await request('/robots.txt')).html;
check(robots.includes('OAI-SearchBot'), 'Missing explicit OpenAI search crawler rule');
const agents = {};
for (const name of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User']) {
  agents[name] = (await request(`/shop/${products[0].pidProduct}`, { headers: { 'User-Agent': name } })).status;
  check(agents[name] === 200, `${name}: product access failed`);
}
const result = { at: new Date().toISOString(), origin, products: products.length, models: models.length, reachableProducts: listingIds.size, sitemapUrls: [...sitemap.matchAll(/<loc>/g)].length, inventoryUnknown: products.filter((p) => !p.productStatus).length, userAgentStatus: agents, caveat: 'User-agent checks use this machine, not verified crawler IPs. No order/payment is submitted.', failures, pages };
if (output) fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, pages: undefined }, null, 2));
if (failures.length) process.exitCode = 1;
