import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) =>
  fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('dashboard is excluded from dark mode', () => {
  const boundary = read('components/theme/SiteThemeProvider.tsx');
  const dashboardProvider = read('app/dashboard/providers.tsx');
  const dashboardHeader = read('components/dashboard/header/header.tsx');
  const globals = read('app/globals.css');

  assert.match(boundary, /pathname === '\/dashboard'/);
  assert.match(boundary, /pathname\.startsWith\('\/dashboard\/'\)/);
  assert.match(boundary, /forcedTheme=\{isDashboard \? 'light' : undefined\}/);
  assert.doesNotMatch(dashboardProvider, /ThemeProvider/);
  assert.doesNotMatch(dashboardHeader, /ModeToggle/);
  assert.doesNotMatch(globals, /--dashboard-page-dark/);
  assert.doesNotMatch(globals, /\.dark \.dashboard/);
  assert.doesNotMatch(globals, /\.dark \.dashboard-page/);
});
