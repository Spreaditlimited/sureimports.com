// Opt-in integration test: refuses production/remote databases.
// SUPPORT_TEST_DATABASE_URL=mysql://root@127.0.0.1:13317/support_pilot node --test tests/support-mysql.integration.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const { randomBytes } = require('node:crypto');
function load(path,deps={}) {
 const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const m={exports:{}};new Function('require','module','exports',code)(id=>id==='server-only'?{}:id in deps?deps[id]:require(id),m,m.exports);return m.exports;
}
test('real MySQL: migration, concurrent retry, persistence, private notes and metrics', { skip: !process.env.SUPPORT_TEST_DATABASE_URL }, async () => {
 const url=new URL(process.env.SUPPORT_TEST_DATABASE_URL);
 assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'13317');assert.equal(url.pathname,'/support_pilot');
 const db=new PrismaClient({datasources:{db:{url:url.toString()}}});
 const policy=load('lib/support/policy.ts');
 const {supportStore}=load('lib/support/store.ts',{'./policy':policy});
 const store=supportStore(db);
 const actor={kind:'CUSTOMER',brand:'SURE_IMPORTS',id:'qa-'+randomBytes(8).toString('hex')};
 const agent={kind:'AGENT',brand:'SUPPORT_TEAM',id:'qa-agent'};
 const create={requestKey:'create-retry-key-1234',subject:'Local test conversation',body:'A question about my shipment'};
 try {
  const ids=await Promise.all(Array.from({length:4},()=>store.create(actor,create,'United Kingdom')));
  assert.equal(new Set(ids).size,1);
  const id=ids[0];
  await assert.rejects(store.history({...actor,id:'another-customer'},id,0),e=>e.status===404);
  await assert.rejects(store.history({...actor,brand:'LINESCOUT'},id,0),e=>e.status===404);
  const reply={requestKey:'reply-retry-key-1234',body:'Please check this shipment.',internal:false};
  await Promise.all(Array.from({length:5},()=>store.send(actor,id,reply)));
  let history=await store.history(actor,id,0);assert.equal(history.messages.length,2);
  const cursor=history.messages.at(-1).id;
  await store.send(agent,id,{requestKey:'internal-note-key-1234',body:'Private operational note',internal:true});
  history=await store.history(actor,id,cursor);assert.equal(history.messages.length,0);assert.equal(history.conversation.firstResponseAt,null);
  await store.send(agent,id,{requestKey:'agent-reply-key-1234',body:'We are checking your shipment.',internal:false});
  history=await store.history(actor,id,cursor);assert.equal(history.messages.length,1);assert.ok(history.conversation.firstResponseAt);assert.equal(history.conversation.status,'WAITING_CUSTOMER');
  assert.equal((await store.history(agent,id,0)).messages.length,4);
  await store.setStatus(agent,id,'RESOLVED');
  await store.send(actor,id,{requestKey:'followup-message-1234',body:'One more question',internal:false});
  history=await store.history(actor,id,0);assert.equal(history.conversation.status,'OPEN');assert.equal(history.conversation.resolvedAt,null);
  assert.equal(history.conversation.assignedTo,agent.id);
  const metrics=await store.analytics(agent);assert.ok(metrics.total>=1);assert.ok(metrics.avgFirstResponseSeconds>=0);
  assert.doesNotThrow(()=>JSON.stringify(metrics));
  // A separate client verifies durable storage, not an in-process cache.
  const fresh=new PrismaClient({datasources:{db:{url:url.toString()}}});
  try { assert.equal((await supportStore(fresh).history(actor,id,0)).messages.length,4); } finally { await fresh.$disconnect(); }
 } finally { await db.$disconnect(); }
});
