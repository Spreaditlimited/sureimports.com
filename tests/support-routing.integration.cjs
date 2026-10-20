const test = require('node:test'),
  assert = require('node:assert/strict'),
  fs = require('node:fs'),
  ts = require('typescript');
const { PrismaClient } = require('@prisma/client'),
  { randomBytes } = require('node:crypto');
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
  'five-minute support alerts follow current assignment and skip messages already read',
  { skip: !process.env.SUPPORT_TEST_DATABASE_URL },
  async () => {
    const url = new URL(process.env.SUPPORT_TEST_DATABASE_URL);
    assert.equal(url.hostname, '127.0.0.1');
    assert.equal(url.port, '13317');
    assert.equal(url.pathname, '/support_pilot');
    const db = new PrismaClient({
      datasources: { db: { url: url.toString() } },
    });
    const policy = load('lib/support/policy.ts'),
      store = load('lib/support/store.ts', { './policy': policy }).supportStore(
        db,
      ),
      management = load('lib/support/management.ts', {
        './policy': policy,
      }).supportManagement(db);
    const { deliverSupportNotifications } = load(
      'lib/support/notifications.ts',
    );
    const { pushSubscriptions, deliverAdminPush } = load(
      'lib/support/push-store.ts',
      {
        './policy': policy,
        './push-policy': load('lib/support/push-policy.ts'),
      },
    );
    const suffix = randomBytes(8).toString('hex'),
      a = 'routing-a-' + suffix,
      b = 'routing-b-' + suffix,
      customer = {
        kind: 'CUSTOMER',
        id: 'routing-c-' + suffix,
        brand: 'SURE_IMPORTS',
      },
      agent = { kind: 'AGENT', id: a, brand: 'SUPPORT_TEAM' };
    const emailA = a + '@example.test',
      emailB = b + '@example.test',
      endpointA = 'https://fcm.googleapis.com/fcm/send/' + a,
      endpointB = 'https://fcm.googleapis.com/fcm/send/' + b;
    let id;
    let counter = 0;
    async function due() {
      await db.$executeRaw`UPDATE support_notifications SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY) WHERE conversationId<>${id}`;
      await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY) WHERE conversationId<>${id}`;
      await db.$executeRaw`UPDATE support_notifications SET availableAt=NOW(3) WHERE conversationId=${id}`;
      await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=NOW(3) WHERE conversationId=${id}`;
    }
    async function send() {
      await store.send(customer, id, {
        requestKey: 'routing-msg-' + suffix + '-' + counter++,
        body: 'Please help',
        internal: false,
      });
    }
    async function deliver() {
      const emails = [],
        pushes = [];
      await deliverSupportNotifications(db, async (n) => emails.push(n.to));
      await deliverAdminPush(db, async (s) => pushes.push(s.endpoint));
      return { emails, pushes };
    }
    try {
      await db.$executeRaw`INSERT INTO admin (pidUser,userStatus,userEmail) VALUES (${a},'L1',${emailA}),(${b},'L1',${emailB})`;
      for (const [adminId, endpoint] of [
        [a, endpointA],
        [b, endpointB],
      ])
        await pushSubscriptions(db).subscribe(adminId, {
          endpoint,
          keys: { p256dh: 'A'.repeat(87), auth: 'B'.repeat(22) },
        });
      id = await store.create(
        customer,
        {
          requestKey: 'routing-create-' + suffix,
          subject: 'Routing check',
          body: 'Please help',
        },
        null,
      );
      const [emailDelay] =
        await db.$queryRaw`SELECT TIMESTAMPDIFF(SECOND,NOW(3),availableAt) AS delay FROM support_notifications WHERE conversationId=${id}`;
      const [pushDelay] =
        await db.$queryRaw`SELECT MIN(TIMESTAMPDIFF(SECOND,NOW(3),availableAt)) AS delay FROM support_push_deliveries WHERE conversationId=${id}`;
      assert.ok(emailDelay.delay >= 295);
      assert.ok(pushDelay.delay >= 295);
      // Isolate this run without making its five-minute jobs due.
      await db.$executeRaw`UPDATE support_notifications SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY) WHERE conversationId<>${id}`;
      await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY) WHERE conversationId<>${id}`;
      assert.deepEqual(await deliver(), { emails: [], pushes: [] });
      await due();
      let result = await deliver();
      assert.ok(
        result.emails.includes(emailA) &&
          result.emails.includes(emailB) &&
          result.emails.includes('hello@sureimports.com'),
      );
      assert.ok(
        result.pushes.includes(endpointA) && result.pushes.includes(endpointB),
      );
      await send();
      await management.assign(agent, id, a);
      await due();
      result = await deliver();
      assert.deepEqual(result.emails, [emailA]);
      assert.deepEqual(result.pushes, [endpointA]);
      await send();
      const last = (await store.history(agent, id, 0)).messages.at(-1).id;
      await management.read(agent, id, last);
      await due();
      result = await deliver();
      assert.deepEqual(result, { emails: [], pushes: [] });
      await send();
      await management.assign(agent, id, b);
      await due();
      result = await deliver();
      assert.deepEqual(result.emails, [emailB]);
      assert.deepEqual(result.pushes, [endpointB]);
      await send();
      await management.assign(agent, id, null);
      await due();
      result = await deliver();
      assert.ok(
        result.emails.includes(emailA) && result.emails.includes(emailB),
      );
      assert.ok(
        result.pushes.includes(endpointA) && result.pushes.includes(endpointB),
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
      await db.$executeRaw`DELETE FROM support_push_subscriptions WHERE adminId IN (${a},${b})`;
      await db.$executeRaw`DELETE FROM admin WHERE pidUser IN (${a},${b})`;
      await db.$disconnect();
    }
  },
);
