const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(path, deps = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const m = { exports: {} };
  new Function('require','module','exports',source)(id => id === 'server-only' ? {} : id in deps ? deps[id] : require(id),m,m.exports);
  return m.exports;
}
const policy = load('lib/support/policy.ts');
const { supportStore } = load('lib/support/store.ts', { './policy': policy });
const { supportEndpoints } = load('lib/support/http.ts', { './policy': policy });
const customer = { id: 'customer-one', kind: 'CUSTOMER', brand: 'SURE_IMPORTS' };
const agent = { id: 'agent-one', kind: 'AGENT', brand: 'SUPPORT_TEAM' };
const id = 'a'.repeat(32);
const input = { requestKey: 'retry-key-123456789', body: 'Please help with my order.', internal: false };
const conversation = { id, customerId: customer.id, brand: customer.brand, status: 'OPEN', subject: 'My order' };
function request(body, origin = 'https://www.sureimports.com') {
  return new Request('https://www.sureimports.com/api/support/conversations', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });
}
function database() {
  const state = { conversation: { ...conversation }, messages: [], count: 0, events: [] };
  function args(query, values) { return { sql: typeof query === 'string' ? query : query.join('?'), values }; }
  const db = {
    $queryRawUnsafe: async (query,...values) => {
      if (query.includes('FROM support_conversations')) return state.conversation ? [{...state.conversation}] : [];
      if (query.includes('FROM support_messages')) return state.messages.filter(m => m.id > values[1] && (!query.includes('internal=FALSE') || !m.internal));
      throw Error(query);
    },
    $queryRaw: async (query,...values) => {
      const { sql } = args(query, values);
      if (sql.includes('TIMESTAMPDIFF')) return [{ messageCount: state.count, elapsed: 0 }];
      if (sql.includes('SELECT id, body, internal')) return state.messages.filter(m => m.conversationId === values[0] && m.authorId === values[1] && m.authorKind === values[2] && m.requestKey === values[3]);
      if (sql.includes('JOIN support_messages')) return state.messages.filter(m => m.requestKey === values[3] && m.authorId === values[1]).map(m => ({ id: m.conversationId, body: m.body, subject: state.conversation.subject }));
      throw Error(sql);
    },
    $executeRaw: async (query,...values) => {
      const { sql } = args(query, values); state.events.push(sql);
      if (sql.startsWith('INSERT INTO support_messages')) {
        state.messages.push({ id: state.messages.length + 1, conversationId: values[0], authorId: values[1], authorKind: values[2], requestKey: values[3], body: values[4], internal: Boolean(values[5]) });
      } else if (sql.startsWith('INSERT INTO support_conversations')) {
        state.conversation = { id: values[0], brand: values[1], customerId: values[2], ownerKind: values[3], orderId: values[4], subject: values[6], country: values[7], status: 'OPEN' };
      } else if (sql.startsWith('UPDATE support_rate_limits')) state.count++;
      else if (sql.includes("SET status='WAITING_CUSTOMER'")) { state.conversation.status='WAITING_CUSTOMER'; state.conversation.firstResponseAt ||= new Date(); }
      else if (sql.includes("SET status='OPEN'")) { state.conversation.status='OPEN'; state.conversation.resolvedAt=null; }
      else if (sql.includes('SET status=?')) state.conversation.status=values[0];
      return 1;
    },
  };
  let queue=Promise.resolve();
  db.$transaction = work => {
    const run=queue.then(async()=> { const before=structuredClone(state); try { return await work(db); } catch(e) { Object.assign(state,before); throw e; } });
    queue=run.catch(()=>{});return run;
  };
  return { state, store: supportStore(db) };
}

test('ownership includes brand and customer; inaccessible IDs return the same 404', () => {
  for (const row of [undefined,{ ...conversation,customerId:'someone-else' },{ ...conversation,brand:'LINESCOUT' }]) assert.throws(()=>policy.assertConversationAccess(customer,row),e=>e.status===404);
  assert.doesNotThrow(()=>policy.assertConversationAccess(customer,conversation));
  assert.throws(()=>policy.assertMessageAccess(customer,true),e=>e.status===403);
});
test('input rejects forged ownership, oversize text, unsupported status and invalid cursors',()=>{
  assert.equal(policy.messageSchema.safeParse({...input,customerId:'other'}).success,false);
  assert.equal(policy.messageSchema.safeParse({...input,body:'x'.repeat(4001)}).success,false);
  assert.equal(policy.messageSchema.safeParse({...input,body:'  '}).success,false);
  assert.equal(policy.statusSchema.safeParse({status:'DELETED'}).success,false);
  for(const cursor of ['-1','1e2','1.5','9007199254740992']) assert.throws(()=>policy.messageCursor(cursor));
  assert.equal(policy.messageCursor(null),0);
});
test('message retries and concurrent retries persist exactly once',async()=>{
  const {store,state}=database();
  await Promise.all([store.send(customer,id,input),store.send(customer,id,input)]);
  assert.equal(state.messages.length,1);assert.equal(state.count,1);
  await assert.rejects(store.send(customer,id,{...input,body:'Changed retry'}),e=>e.status===409);
  assert.equal(state.messages.length,1);
});
test('conversation creation retries reuse the conversation and reject changed payloads',async()=>{
  const {store,state}=database();state.conversation=null;
  const create={requestKey:input.requestKey,body:input.body,subject:'A shipping question'};
  const first=await store.create(customer,create,'United Kingdom');
  const second=await store.create(customer,create,'United Kingdom');
  assert.equal(first,second);assert.equal(state.messages.length,1);
  await assert.rejects(store.create(customer,{...create,subject:'Different'},null),e=>e.status===409);
});
test('customer cannot read another conversation or send an internal note',async()=>{
  const {store,state}=database();state.conversation.customerId='someone-else';
  await assert.rejects(store.history(customer,id,0),e=>e.status===404);
  await assert.rejects(store.send(customer,id,input),e=>e.status===404);
  await assert.rejects(store.send(customer,id,{...input,internal:true}),e=>e.status===403);
  assert.equal(state.messages.length,0);
});
test('internal notes stay out of customer history and do not count as a human reply',async()=>{
  const {store,state}=database();
  await store.send(agent,id,{...input,internal:true});
  assert.equal((await store.history(customer,id,0)).messages.length,0);
  assert.equal((await store.history(agent,id,0)).messages.length,1);
  assert.equal(state.conversation.firstResponseAt,undefined);
  assert.equal(state.conversation.status,'OPEN');
  await store.send(agent,id,{...input,requestKey:'public-reply-12345678'});
  assert.equal(state.conversation.status,'WAITING_CUSTOMER');assert.ok(state.conversation.firstResponseAt);
});
test('new customer message reopens a resolved conversation; customers cannot set status or read analytics',async()=>{
  const {store,state}=database();state.conversation.status='RESOLVED';state.conversation.resolvedAt=new Date();
  await store.send(customer,id,input);assert.equal(state.conversation.status,'OPEN');assert.equal(state.conversation.resolvedAt,null);
  await assert.rejects(store.setStatus(customer,id,'RESOLVED'),e=>e.status===403);
  await assert.rejects(store.analytics(customer),e=>e.status===403);
});
test('rate limit rejects a new message atomically',async()=>{
  const {store,state}=database();state.count=20;
  await assert.rejects(store.send(customer,id,input),e=>e.status===429);
  assert.equal(state.messages.length,0);assert.equal(state.count,20);
});
test('HTTP guard disables pilot, rejects CSRF and resolves identity server-side',async()=>{
  const old=process.env.SUPPORT_CHAT_ENABLED;
  let actorSeen;
  const endpoints=supportEndpoints({create:async actor=>{actorSeen=actor;return id;}},async()=>({actor:customer}));
  try {
    delete process.env.SUPPORT_CHAT_ENABLED;
    assert.equal((await endpoints.create(request({}))).status,404);
    process.env.SUPPORT_CHAT_ENABLED='true';
    assert.equal((await endpoints.create(request({},'https://evil.example'))).status,403);
    assert.equal((await endpoints.create(request({requestKey:input.requestKey,subject:'Question',body:'Help'}))).status,200);
    assert.deepEqual(actorSeen,customer);
    const denied=supportEndpoints({},async()=>null);
    assert.equal((await denied.list(new Request('https://www.sureimports.com/api/support/conversations'))).status,403);
    const response=await endpoints.create(request({requestKey:input.requestKey,subject:'Question',body:'Help',customerId:'victim'}));
    assert.equal(response.status,400);assert.equal(response.headers.get('cache-control'),'private, no-store');
  } finally { if(old===undefined)delete process.env.SUPPORT_CHAT_ENABLED;else process.env.SUPPORT_CHAT_ENABLED=old; }
});
test('streamed body limit applies even without a content-length header',async()=>{
  const old=process.env.SUPPORT_CHAT_ENABLED;process.env.SUPPORT_CHAT_ENABLED='true';
  try {
    const endpoints=supportEndpoints({},async()=>({actor:customer}));
    const response=await endpoints.create(request({body:'a'.repeat(25000)}));
    assert.equal(response.status,413);
  } finally { if(old===undefined)delete process.env.SUPPORT_CHAT_ENABLED;else process.env.SUPPORT_CHAT_ENABLED=old; }
});
