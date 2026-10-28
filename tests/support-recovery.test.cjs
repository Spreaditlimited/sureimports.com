const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const moduleObject = { exports: {} };
const source = ts.transpileModule(fs.readFileSync('lib/support/recovery.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
new Function('require', 'module', 'exports', source)((id) => id === 'server-only' ? {} : require(id), moduleObject, moduleObject.exports);
const recovery = moduleObject.exports;
test('guest email link is signed, scoped and expires', () => {
  const old = process.env.CRON_SECRET;
  process.env.CRON_SECRET = 'test-secret-for-support-recovery';
  try {
    const guestId = 'a'.repeat(32);
    const conversationId = 'b'.repeat(32);
    const token = recovery.createSupportRecoveryToken(guestId, conversationId);
    assert.equal(recovery.verifySupportRecoveryToken(token).guestId, guestId);
    assert.equal(recovery.verifySupportRecoveryToken(token).conversationId, conversationId);
    assert.equal(recovery.verifySupportRecoveryToken(token.slice(0, -1) + 'A'), null);
  } finally {
    if (old === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = old;
  }
});
