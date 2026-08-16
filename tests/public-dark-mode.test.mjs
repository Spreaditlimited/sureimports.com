import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) =>
  fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the public application defaults to light and persists an explicit theme choice', () => {
  const rootLayout = read('app/layout.tsx');
  const provider = read('components/dashboard/theme-provider.tsx');
  const boundary = read('components/theme/SiteThemeProvider.tsx');

  assert.match(rootLayout, /<SiteThemeProvider>/);
  assert.match(rootLayout, /<AuthProvider>/);
  assert.match(provider, /attribute="class"/);
  assert.match(provider, /defaultTheme="light"/);
  assert.match(provider, /enableSystem=\{false\}/);
  assert.match(provider, /storageKey="sureimports-theme"/);
  assert.doesNotMatch(provider, /forcedTheme/);
  assert.match(boundary, /pathname\.startsWith\('\/dashboard\/'\)/);
  assert.match(boundary, /forcedTheme=\{isDashboard \? 'light' : undefined\}/);
});

test('the public navigation exposes accessible desktop and mobile theme controls', () => {
  const navbar = read('components/home/NavBar.tsx');
  const toggle = read('components/home/ThemeToggle.tsx');

  assert.match(navbar, /<ThemeToggle lightSurface=\{useLightNavbar\}/);
  assert.match(navbar, /<ThemeToggle \/>/);
  assert.match(toggle, /resolvedTheme === 'dark'/);
  assert.match(toggle, /aria-label="Toggle light and dark mode"/);
  assert.match(toggle, /dark:hidden/);
  assert.match(toggle, /dark:block/);
});

test('public route groups share one maintainable dark-mode contract', () => {
  const publicLayouts = [
    'app/(home)/layout.tsx',
    'app/(procurement)/buy-from-chinese-websites/layout.tsx',
    'app/(shipping)/ship-with-us/layout.tsx',
    'app/(sourcing)/source-products-from-china/layout.tsx',
    'app/(store)/buy-phones-from-china/layout.tsx',
    'app/(faya)/faya/layout.tsx',
    'app/(laptops-for-business)/layout.tsx',
    'app/shop/layout.tsx',
  ];

  for (const file of publicLayouts) {
    assert.match(read(file), /public-site-theme/, file);
  }

  const legacyPages = [
    'app/(home)/supplier-intelligence/page.tsx',
    'app/(home)/supplier-intelligence/reports/page.tsx',
    'app/(home)/supplier-intelligence/reports/[slug]/page.tsx',
    'app/(home)/supplier-intelligence/reports/checkout/verify/page.tsx',
    'app/(home)/book-consultation/page.tsx',
    'app/(home)/book-consultation/verify/page.tsx',
    'app/(home)/track/TrackingClient.tsx',
  ];

  for (const file of legacyPages) {
    assert.doesNotMatch(read(file), /public-dark-surface/, file);
  }

  const globals = read('app/globals.css');
  assert.match(globals, /\.public-site-theme/);
  assert.match(globals, /--public-section-dark: 2 6 23/);
  assert.match(globals, /\.public-site-theme main > section/);
  assert.match(globals, /\[class~='bg-white'\]/);
  assert.match(globals, /\[class~='text-slate-950'\]/);
  assert.match(globals, /\[class~='border-slate-200'\]/);
  assert.match(globals, /section\[class~='border-y'\]/);
  assert.match(globals, /input:not\(\[type='checkbox'\]\)/);
  assert.match(globals, /-webkit-autofill/);

  const consultationPage = read('app/(home)/book-consultation/page.tsx');
  assert.match(consultationPage, /searchParams\?: Promise</);
  assert.match(consultationPage, /await searchParams/);
});
