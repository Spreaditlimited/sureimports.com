const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('node:crypto');
const db = new PrismaClient();
function load(prisma) {
  const source = ts.transpileModule(
    fs.readFileSync(
      '/Users/tochukwunkwocha/projects/admin.sureimports.com/lib/marketing/whatsapp.ts',
      'utf8',
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  const m = { exports: {} };
  vm.runInNewContext('(function(require,module,exports){' + source + '})', {
    console,
    Date,
    URLSearchParams,
  })((n) => (n === '@/lib/prisma' ? { prisma } : require(n)), m, m.exports);
  return m.exports;
}
(async () => {
  try {
    await db.$transaction(
      async (tx) => {
        const wrapped = {
          $queryRaw: tx.$queryRaw.bind(tx),
          $executeRaw: tx.$executeRaw.bind(tx),
          $transaction: (fn) => fn(tx),
        };
        const api = load(wrapped);
        const id = randomUUID();
        await tx.$executeRaw`INSERT INTO whatsapp_clicks(id,site,path,destination,placement,device,service,audience) VALUES(${id},'sureimports','/verification-fixture','447881194138','page','mobile','General','sales')`;
        const countBefore =
          await tx.$queryRaw`SELECT COUNT(*) n FROM whatsapp_clicks WHERE id=${id}`;
        await tx.$executeRaw`INSERT INTO whatsapp_clicks(id,site,path,destination,placement,device,service,audience) VALUES(${id},'sureimports','/verification-fixture','447881194138','page','mobile','General','sales') ON DUPLICATE KEY UPDATE id=id`;
        assert.equal(Number(countBefore[0].n), 1);
        const receivedAt = new Date(Date.now() + 1000).toISOString();
        const lead = {
          name: 'Verification fixture',
          phone: '+447700900123',
          site: 'sureimports',
          status: 'NEW',
          clickId: id,
          notes: 'Transactional smoke test; rolled back',
          receivedAt,
        };
        const leadId = await api.saveLead(lead, 'whatsapp-smoke-test');
        await assert.rejects(() => api.saveLead(lead, 'whatsapp-smoke-test'));
        await assert.rejects(() =>
          api.saveLead(
            { ...lead, phone: '+447700900124', site: 'partner' },
            'whatsapp-smoke-test',
          ),
        );
        await api.saveLead(
          { ...lead, id: leadId, status: 'QUALIFIED' },
          'whatsapp-smoke-test',
        );
        const data = await api.report(
          new URLSearchParams('period=today&site=sureimports'),
        );
        assert.ok(data.totals.clicks >= 1);
        assert.ok(data.matched >= 1);
        assert.ok(data.clicks.some((c) => c.id === id));
        const saved =
          await tx.$queryRaw`SELECT status FROM whatsapp_leads WHERE id=${leadId}`;
        assert.equal(saved[0].status, 'QUALIFIED');
        console.log(
          'PASS: real database insertion, duplicate protection, lead linking, site validation, editing and report SQL. Rolling back fixtures.',
        );
        throw Error('ROLLBACK_TEST_FIXTURES');
      },
      { timeout: 60000 },
    );
  } catch (e) {
    if (e.message !== 'ROLLBACK_TEST_FIXTURES') throw e;
  }
  const leftovers =
    await db.$queryRaw`SELECT COUNT(*) n FROM whatsapp_leads WHERE createdBy='whatsapp-smoke-test'`;
  assert.equal(Number(leftovers[0].n), 0);
  console.log('PASS: no test leads retained.');
})()
  .catch((e) => {
    console.error('WhatsApp database smoke test failed:', e.code || e.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
