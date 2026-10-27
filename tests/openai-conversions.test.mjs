import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(
  new URL('../lib/marketing/openaiEvents.ts', import.meta.url),
  'utf8',
);
function setup(cookie = '') {
  const scripts = [];
  const storage = new Map();
  const context = vm.createContext({
    exports: {},
    window: {},
    document: {
      cookie,
      createElement: () => ({}),
      head: { appendChild: (s) => scripts.push(s) },
    },
    sessionStorage: {
      getItem: (k) => storage.get(k),
      setItem: (k, v) => storage.set(k, v),
    },
  });
  vm.runInContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    context,
  );
  return { context, api: context.exports, scripts };
}
test('no SDK or registration event before consent or after decline', () => {
  for (const cookie of ['', 'consent=false']) {
    const { api, scripts, context } = setup(cookie);
    api.syncOpenAIConsent();
    api.trackOpenAIRegistration('registration_test');
    assert.equal(scripts.length, 0);
    assert.equal(context.window.oaiq, undefined);
  }
});
test('consented registration is initialized once and deduplicated across module reload', () => {
  const { api, scripts, context } = setup('consent=true');
  api.syncOpenAIConsent();
  api.trackOpenAIRegistration('registration_test');
  api.trackOpenAIRegistration('registration_test');
  assert.equal(scripts.length, 1);
  const events = context.window.oaiq.q.filter((a) => a[0] === 'measure');
  assert.equal(events.length, 1);
  assert.equal(events[0][1], 'registration_completed');
  assert.equal(events[0][2].type, 'customer_action');
  assert.equal(events[0][3].event_id, 'registration_test');
  assert.equal(events[0][3].opt_out, true);
  const second = {
    exports: {},
    window: context.window,
    document: context.document,
    sessionStorage: context.sessionStorage,
  };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    second,
  );
  second.exports.trackOpenAIRegistration('registration_test');
  assert.equal(
    context.window.oaiq.q.filter((a) => a[0] === 'measure').length,
    1,
  );
  context.document.cookie = 'consent=false';
  api.syncOpenAIConsent();
  api.trackOpenAIRegistration('registration_other');
  assert.equal(context.window.oaiq.q.at(-1)[0], 'consent');
  assert.equal(context.window.oaiq.q.at(-1)[1], false);
  assert.equal(
    context.window.oaiq.q.filter((a) => a[0] === 'measure').length,
    1,
  );
});
