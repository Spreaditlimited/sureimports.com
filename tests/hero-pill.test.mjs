import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
test('hero pills have a distinct solid fill rather than an outline treatment', () => {
  const css = readFileSync(new URL('../components/home/HeroPill.module.css', import.meta.url), 'utf8');
  assert.match(css, /background: #f8f7ff !important/);
  assert.match(css, /border: 1px solid transparent/);
  assert.match(css, /background: #292539 !important/);
});
test('hero badges use block flex layout and a single headline gap', () => {
  const css = readFileSync(new URL('../components/home/HeroPill.module.css', import.meta.url), 'utf8');
  assert.match(css, /display: flex/);
  assert.match(css, /margin-inline: auto/);
  assert.match(css, /margin-bottom: 24px/);
  assert.match(css, /\+ h1\s*\{\s*margin-top: 0/);
});
test('popular searches use solid semantic surfaces, including hover', () => {
  const css = readFileSync(new URL('../components/intelligence/ReportSearchExperience.module.css', import.meta.url), 'utf8');
  assert.match(css, /background: var\(--si-surface\)/);
  assert.match(css, /:hover \{[^}]*color: var\(--si-ink\)/);
  const source = readFileSync(new URL('../components/intelligence/ReportSearchExperience.tsx', import.meta.url), 'utf8');
  assert.ok(source.includes('className={styles.quickSearch}'));
});
const pages = [
  "components/intelligence/ReportSearchExperience.tsx",
  "components/Hero.tsx",
  "app/shop/page.tsx",
  "app/(laptops-for-business)/laptops-for-business/page.tsx",
  "app/(shipping)/ship-with-us/page.tsx",
  "app/(procurement)/buy-from-chinese-websites/page.tsx",
  "app/(home)/supplier-intelligence/page.tsx",
  "app/(home)/supplier-verification/page.tsx",
  "app/(home)/corporate-sourcing/page.tsx",
  "app/(home)/import-from-china-to-nigeria/page.tsx",
  "app/(home)/shipping-rate/page.tsx",
  "app/(home)/body-camera-solutions/page.tsx",
  "app/(home)/body-camera-solutions/[slug]/page.tsx",
  "app/(home)/book-consultation/page.tsx",
  "app/(home)/tools/air-vs-sea-calculator/page.tsx",
  "app/(home)/tools/retail-price-builder/page.tsx",
  "app/(home)/tools/cbm-volumetric-weight-calculator/page.tsx",
  "app/(home)/tools/carton-optimization/page.tsx",
  "app/(home)/tools/landed-cost-estimator/page.tsx",
  "app/(home)/tools/generator-sizing/page.tsx",
  "app/(home)/components/TermsAndConditions.tsx",
  "app/(home)/components/PrivacyPolicy.tsx",
  "app/(home)/components/ShippingPolicy.tsx",
  "app/(home)/components/WarrantyPolicy.tsx",
  "app/(home)/components/BlogList.tsx",
  "app/(home)/components/BlogDetail.tsx",
  "app/(home)/components/AboutUs.tsx",
  "app/(store)/buy-phones-from-china/componenets/banner.tsx",
  "app/(sourcing)/source-products-from-china/sourcing/hero.tsx",
  "app/(procurement)/buy-from-chinese-websites/buy/banner.tsx",
  "app/(faya)/components/home/Hero.tsx"
];
for (const page of pages) {
  test(`shared hero pill: ${page}`, () => {
    const source = readFileSync(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.ok(source.includes("import HeroPill from '@/components/home/HeroPill'"));
    assert.ok(source.includes('<HeroPill'));
  });
}
