import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('all procurement bank-deposit states use paired semantic button colours', () => {
  const source = read('app/dashboard/procurement/view-orders/components/products-table/orders-view-more.tsx');
  assert.equal((source.match(/className=\{bankDepositStyles.button\}/g) || []).length, 2);
  assert.ok(source.includes('`${bankDepositStyles.button} flex-1`'));
  const css = read('components/dashboard/BankDepositButton.module.css');
  assert.match(css, /background-color: var\(--si-primary\)/);
  assert.match(css, /color: var\(--si-on-primary\)/);
  assert.match(css, /:disabled/);
  assert.match(css, /:global\(\.dark\) \.button\.button:disabled \{\s*background-color: var\(--si-raised\)/);
  assert.match(css, /border: 0/);
  assert.match(css, /color: #94a3b8/);
});

test('Pay Supplier empty state does not cancel the header overlap', () => {
  assert.ok(!read('app/dashboard/pay-supplier/[statusx]/page.tsx').includes('className="pt-24"'));
  assert.ok(read('app/dashboard/pay-supplier/layout.tsx').includes('darkHeader.overlap'));
});

test('Refunds server page does not import client hooks', () => {
  const page = read('app/dashboard/(refunds)/refunds/page.tsx');
  assert.doesNotMatch(page, /import\s+[^;]*\buseState\b[^;]*from\s+['"]react['"]/);
  assert.ok(page.includes("if (!user?.pidUser) redirect('/auth/login')"));
});

test('dashboard does not reset inherited semantic theme colours', () => {
  for (const path of ['app/globals.css', 'app/design-system.css', 'app/dashboard-refinements.css']) {
    postcss.parse(read(path)).walkRules((rule) => {
      if (!rule.selector.includes('.dashboard')) return;
      rule.walkDecls((declaration) => {
        assert.ok(!['--background', '--foreground'].includes(declaration.prop), `${path}: ${rule.selector} resets ${declaration.prop}`);
      });
    });
  }
});

test('shipping list preserves overlap and has readable dark-surface heading', () => {
  const layout = read('app/dashboard/shipping-only/[statusx]/layout.tsx');
  assert.ok(layout.includes('-mt-16'));
  assert.ok(read('app/dashboard/shipping-only/components/orders.tsx').includes('si-on-dark-heading'));
});

test('sidebar uses navigation styles rather than primary button colours', () => {
  const sidebar = read('components/dashboard/sidenavbar/components/side-nav.tsx');
  assert.ok(!sidebar.includes('buttonVariants'));
  assert.ok(sidebar.includes('si-nav-item'));
});

test('corporate sourcing preserves overlap with conditional dark-surface text', () => {
  const page = read('app/dashboard/corporate-sourcing/page.tsx');
  assert.ok(page.includes('-mt-16'));
  assert.ok(page.includes("showForm ? 'text-slate-900 dark:text-white' : darkHeader.heading"));
});

test('all Sync controls explicitly use the dark-surface button treatment', () => {
  for (const path of ['app/dashboard/corporate-sourcing/page.tsx', 'app/dashboard/pay-supplier/layout.tsx', 'app/dashboard/shipping-only/[statusx]/layout.tsx', 'app/dashboard/verify-supplier/components/SupplierVerificationDashboard.tsx']) {
    assert.ok(read(path).includes('si-dashboard-sync'), path);
  }
});

test('Sync contrast correction does not change its original surface or border', () => {
  postcss.parse(read('app/dashboard-refinements.css')).walkRules((rule) => {
    if (!rule.selector.includes('si-dashboard-sync')) return;
    rule.walkDecls((declaration) => assert.equal(declaration.prop, 'color'));
  });
});

test('legacy dark-only card backgrounds remain scoped to dark mode', () => {
  postcss.parse(read('app/dashboard-refinements.css')).walkRules((rule) => {
    if (rule.selector.startsWith('.dashboard') && rule.selector.includes('dark\\:bg-')) {
      assert.fail(`Unscoped dark surface override: ${rule.selector}`);
    }
  });
});
