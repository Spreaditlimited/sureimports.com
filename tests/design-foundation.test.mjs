import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const tokens = postcss.parse(read('design-system/tokens.css'));
function palette(dark) {
  const values = {};
  tokens.walkRules(rule => {
    if (rule.selector !== `html[data-si-foundation]${dark ? '.dark' : ''}`) return;
    rule.walkDecls(decl => { values[decl.prop] = decl.value; });
  });
  return values;
}
function luminance(hex) {
  let digits = hex.slice(1);
  if (digits.length === 3) digits = [...digits].map(c => c + c).join('');
  return digits.match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x,y) + .05) / (Math.min(x,y) + .05); }
for (const dark of [false, true]) {
  test(`${dark ? 'dark' : 'light'} theme text and field boundaries meet contrast targets`, () => {
    const p = { ...palette(false), ...(dark ? palette(true) : {}) };
    for (const [fg,bg] of [['ink','surface'],['muted','surface'],['accent','soft'],['on-primary','primary'],['success','success-soft'],['warning','warning-soft'],['danger','danger-soft'],['info','info-soft']]) {
      const ratio = contrast(p[`--si-${fg}`],p[`--si-${bg}`]);
      assert.ok(ratio >= 4.5, `${fg}/${bg}: ${ratio.toFixed(2)} must be >= 4.5`);
    }
    assert.ok(contrast(p['--si-control-border'],p['--si-surface']) >= 3);
  });
}
test('native select excludes hidden and multi-select controls and reserves arrow space', () => {
  const css = postcss.parse(read('design-system/components.css'));
  let native;
  css.walkRules(rule => { if (rule.nodes.some(n => n.prop === 'appearance' && n.value === 'none')) native = rule; });
  assert.match(native.selector, /:not\(\[multiple\]\):not\(\[size\]\)/);
  assert.match(native.selector, /:not\(\.searchable-select-native\)/);
  assert.ok(native.nodes.some(n => n.prop === 'padding-inline-end' && n.value === '44px'));
  assert.ok(native.nodes.some(n => n.prop === 'background-position' && n.value === 'right 16px center'));
});
test('keyboard focus, reduced motion and forced-colour fallbacks remain available', () => {
  const css = read('design-system/components.css');
  assert.match(css, /:focus-visible[\s\S]*outline: 2px/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  postcss.parse(css).walkDecls(decl => {
    if (!decl.important) return;
    assert.match(decl.parent.selector, /search|cmdk-input/);
    assert.ok(['border', 'border-color', 'outline', 'box-shadow', 'background', 'background-color'].includes(decl.prop));
  });
});
test('shared button variants retain semantic classes for both Slot and buttonVariants links', () => {
  const source = read('components/ui/button.tsx');
  for (const variant of ['primary','secondary','outline','ghost','link','destructive']) assert.ok(source.includes(`si-button-${variant}`));
  assert.match(read('components/ui/input-with-dark-mode.tsx'), /export \{ Input \} from '\.\/input'/);
});

test('permanent dark sections keep readable nested cards in either page theme', () => {
  const css = postcss.parse(read('app/design-system.css'));
  const local = {};
  css.walkRules(rule => {
    if (rule.selector === '.public-site-theme .si-dark-surface') {
      rule.walkDecls(decl => { local[decl.prop] = decl.value; });
    }
  });
  for (const dark of [false, true]) {
    const p = { ...palette(false), ...(dark ? palette(true) : {}), ...local };
    for (const bg of ['canvas', 'surface', 'raised', 'inset']) {
      for (const fg of ['ink', 'muted', 'accent']) {
        assert.ok(contrast(p[`--si-${fg}`], p[`--si-${bg}`]) >= 4.5, `${fg}/${bg} on permanent dark section`);
      }
    }
    assert.ok(contrast(p['--si-primary'], p['--si-on-primary']) >= 4.5);
  }
});
