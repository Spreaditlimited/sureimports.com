const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const { randomBytes } = require('node:crypto');
function load(path, deps = {}) {
  const m = { exports: {} };
  new Function(
    'require',
    'module',
    'exports',
    ts.transpileModule(fs.readFileSync(path, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  )(
    (id) => (id === 'server-only' ? {} : id in deps ? deps[id] : require(id)),
    m,
    m.exports,
  );
  return m.exports;
}
test(
  'claimed chats use account names; guest and account replies disclose only admin first names',
  { skip: !process.env.SUPPORT_TEST_DATABASE_URL },
  async () => {
    const url = new URL(process.env.SUPPORT_TEST_DATABASE_URL);
    assert.equal(url.hostname, '127.0.0.1');
    assert.equal(url.port, '13317');
    assert.equal(url.pathname, '/support_pilot');
    const db = new PrismaClient({
      datasources: { db: { url: url.toString() } },
    });
    const policy = load('lib/support/policy.ts');
    const store = load('lib/support/store.ts', {
      './policy': policy,
    }).supportStore(db);
    const management = load('lib/support/management.ts', {
      './policy': policy,
    }).supportManagement(db);
    const jar = new Map();
    const guest = load('lib/support/guest.ts', {
      'next/headers': {
        cookies: async () => ({
          get: (k) => (jar.has(k) ? { value: jar.get(k) } : undefined),
          set: (k, v) => jar.set(k, v),
          delete: (k) => jar.delete(k),
        }),
      },
      '@/lib/prisma': { prisma: db },
      './policy': policy,
    });
    const suffix = randomBytes(8).toString('hex');
    const customer = {
      kind: 'CUSTOMER',
      id: 'names-c-' + suffix,
      brand: 'SURE_IMPORTS',
    };
    const agent = {
      kind: 'AGENT',
      id: 'names-a-' + suffix,
      brand: 'SUPPORT_TEAM',
    };
    let id, guestId;
    try {
      // The disposable DB originally used a minimal users fixture.
      for (const column of ['userFirstname', 'userLastname']) {
        const rows =
          await db.$queryRaw`SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name=${column}`;
        if (!rows.length)
          await db.$executeRawUnsafe(
            `ALTER TABLE users ADD COLUMN ${column} VARCHAR(191) NULL`,
          );
      }
      // Match the legacy production ID charset, rather than assuming all tables use utf8mb4.
    await db.$executeRawUnsafe('ALTER TABLE users MODIFY pidUser VARCHAR(191) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL');
    await db.$executeRaw`INSERT INTO users (pidUser,userEmail,userFirstname,userLastname) VALUES (${customer.id},${suffix + '@example.test'},'Ada','Okafor')`;
      await db.$executeRaw`INSERT INTO admin (pidUser,userFirstname,userLastname,userEmail,userStatus) VALUES (${agent.id},' Favour ','PrivateSurname',${'staff-' + suffix + '@example.test'},'L1')`;
      await guest.createGuest();
      const identity = await guest.guestIdentity();
      guestId = identity.actor.id;
      id = await store.create(
        identity.actor,
        {
          requestKey: 'names-create-' + suffix,
          subject: 'Name check ' + suffix,
          body: 'Guest message',
        },
        null,
      );
      await store.send(agent, id, {
        requestKey: 'names-reply-' + suffix,
        body: 'Hello',
        internal: false,
      });
      await store.send(agent, id, {
        requestKey: 'names-note-' + suffix,
        body: 'Staff only',
        internal: true,
      });
      const before = await store.history(identity.actor, id, 0);
      assert.equal(before.conversation.customerName, null);
      assert.equal(before.messages.length, 2);
      assert.equal(before.messages[1].authorName, 'Favour');
      await guest.claimGuest(customer.id);
      const after = await store.history(customer, id, 0);
      assert.equal(after.conversation.customerName, 'Ada Okafor');
      assert.equal(
        after.messages[0].authorKind,
        'GUEST',
        'claim preserves original authorship',
      );
      assert.equal(after.messages[1].authorName, 'Favour');
      assert.equal(
        (await store.list(agent)).find((c) => c.id === id).customerName,
        'Ada Okafor',
      );
      assert.equal(
        (await management.inbox(agent, new URLSearchParams({ q: suffix })))
          .conversations[0].customerName,
        'Ada Okafor',
      );
      assert.equal(
        (await store.history(agent, id, 0)).messages[2].authorName,
        'Favour',
      );
      assert.ok(!JSON.stringify(after).includes('PrivateSurname'));
      assert.ok(!JSON.stringify(after.messages).includes(agent.id));
      assert.ok(!JSON.stringify(after.messages).includes('@example.test'));
      await assert.rejects(
        store.history(identity.actor, id, 0),
        (e) => e.status === 404,
      );
      await assert.rejects(
        store.history({ ...customer, id: 'unrelated' }, id, 0),
        (e) => e.status === 404,
      );
      await db.$executeRaw`UPDATE admin SET userFirstname=NULL WHERE pidUser=${agent.id}`;
      assert.equal(
        (await store.history(customer, id, 0)).messages[1].authorName,
        null,
      );
    } finally {
      if (id) {
        for (const table of [
          'support_messages',
          'support_notifications',
          'support_push_deliveries',
        ])
          await db.$executeRawUnsafe(
            `DELETE FROM ${table} WHERE conversationId=?`,
            id,
          );
        await db.$executeRaw`DELETE FROM support_conversations WHERE id=${id}`;
      }
      if (guestId)
        await db.$executeRaw`DELETE FROM support_guests WHERE id=${guestId}`;
      await db.$executeRaw`DELETE FROM users WHERE pidUser=${customer.id}`;
      await db.$executeRaw`DELETE FROM admin WHERE pidUser=${agent.id}`;
      await db.$disconnect();
    }
  },
);
