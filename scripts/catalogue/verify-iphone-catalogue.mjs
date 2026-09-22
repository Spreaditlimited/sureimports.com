import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const source = JSON.parse(
  await fs.readFile(
    new URL('./iphone-prices-2026-09-22.json', import.meta.url),
  ),
);
const base = process.env.SHOP_TEST_URL || 'http://localhost:3001';
const rows = [];
let totalPages = 1;
for (let page = 1; page <= totalPages; page++) {
  const res = await fetch(
    `${base}/api/shop/products?search=iphone&limit=24&page=${page}`,
  );
  assert.equal(res.status, 200);
  const { data } = await res.json();
  rows.push(...data.products);
  totalPages = data.pagination.totalPages;
}
const iphones = rows.filter((r) => /\biphone\b/i.test(r.productName));
assert.equal(iphones.length, 55);
assert.equal(new Set(iphones.map((r) => r.pidProduct)).size, 55);
for (const [kind, markup] of [
  ['refurbished', 500],
  ['brandNew', 1000],
]) {
  for (const [model, storage, rmb, colour] of source[kind]) {
    const name = `iPhone ${model} ${storage}GB${colour ? ' — ' + colour : ''} — ${kind === 'refurbished' ? 'Refurbished' : 'Brand new'}`;
    const row = iphones.find((r) => r.productName === name);
    assert.ok(row, `Missing ${name}`);
    assert.equal(row.productPrice, (rmb + markup) * 210, name);
    assert.equal(row.productCategory, 'phone');
    assert.equal(row.warrantyPeriod, 'MONTHS12');
    assert.ok(
      row.productDescription.includes('doorstep delivery anywhere in Nigeria'),
    );
  }
}
const visible = await fetch(
  `${base}/api/shop/product/${iphones[0].pidProduct}`,
);
assert.equal(visible.status, 200);
const hidden = await fetch(`${base}/api/shop/product/STORE1743681955067`);
assert.equal(hidden.status, 404);
console.log(
  'PASS: 55 unique iPhones across pagination; every price, category, warranty and delivery description verified; visible details available, hidden details blocked.',
);
