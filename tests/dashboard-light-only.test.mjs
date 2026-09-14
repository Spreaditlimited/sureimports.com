import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) =>
  fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('dashboard honors the same persisted light and dark choice as the public site', () => {
  const boundary = read('components/theme/SiteThemeProvider.tsx');
  const dashboardProvider = read('app/dashboard/providers.tsx');
  const dashboardHeader = read('components/dashboard/header/header.tsx');
  const globals = read('app/globals.css');

  assert.match(boundary, /<ThemeProvider>/);
  assert.doesNotMatch(boundary, /forcedTheme/);
  assert.doesNotMatch(dashboardProvider, /ThemeProvider/);
  assert.match(dashboardHeader, /ThemeToggle/);
  assert.match(globals, /\.dark\s*\{/);
});
