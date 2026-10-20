const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const {PrismaClient}=require('@prisma/client'),{randomBytes}=require('node:crypto');
function load(path,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(id=>id==='server-only'?{}:id in deps?deps[id]:require(id),m,m.exports);return m.exports;}
const policy=load('lib/support/policy.ts'),management=load('lib/support/management.ts',{'./policy':policy}),notices=load('lib/support/notifications.ts'),stores=load('lib/support/store.ts',{'./policy':policy});
test('support management: filtered pages, unread isolation, assignment, reports, and per-recipient email retries',{skip:!process.env.SUPPORT_TEST_DATABASE_URL},async()=>{
 const url=new URL(process.env.SUPPORT_TEST_DATABASE_URL);assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'13317');assert.equal(url.pathname,'/support_pilot');
 const db=new PrismaClient({datasources:{db:{url:url.toString()}}}),store=stores.supportStore(db),m=management.supportManagement(db),suffix=randomBytes(8).toString('hex');
 const admin='mgmt-'+suffix,other='other-'+suffix,excluded='excluded-'+suffix,customer={kind:'CUSTOMER',brand:'SURE_IMPORTS',id:'customer-'+suffix},actor={kind:'AGENT',brand:'SUPPORT_TEAM',id:admin};
 process.env.SUPPORT_CHAT_ENABLED='true';
 try {
  await db.$executeRaw`INSERT INTO admin (pidUser,userStatus,userFirstname,userLastname,userEmail) VALUES (${admin},'L2','Support','One',${'one-'+suffix+'@example.test'}),(${other},'L1','Support','Two',${'two-'+suffix+'@example.test'}),(${excluded},'L2','Eric','Test',${'excluded-'+suffix+'@example.test'})`;
  await db.$executeRaw`INSERT INTO admin_permissions (pidUser,serviceKey,canView,canEdit) VALUES (${admin},'customer_support',TRUE,TRUE),(${excluded},'customer_support',TRUE,FALSE)`;
  const id=await store.create(customer,{requestKey:'create-mgmt-'+suffix,subject:'Search '+suffix,body:'A message'},null);
  const params=new URLSearchParams({q:suffix});let inbox=await m.inbox(actor,params);assert.equal(inbox.total,1);assert.equal(inbox.conversations[0].unreadCount,1);
  const first=(await store.history(actor,id,0)).messages[0].id;await m.read(actor,id,first);assert.equal((await m.inbox(actor,params)).conversations[0].unreadCount,0);assert.equal((await m.inbox({...actor,id:other},params)).conversations[0].unreadCount,1);
  await store.send(customer,id,{requestKey:'follow-mgmt-'+suffix,body:'New message',internal:false});await m.read(actor,id,first);assert.equal((await m.inbox(actor,params)).conversations[0].unreadCount,1,'stale acknowledgments cannot hide newer messages');
  await m.assign(actor,id,other);assert.equal((await m.inbox({...actor,id:other},new URLSearchParams({q:suffix,assigned:'ME'}))).total,1);assert.equal((await m.inbox(actor,new URLSearchParams({q:suffix,assigned:'UNASSIGNED'}))).total,0);
  await assert.rejects(m.assign(actor,id,excluded),e=>e.status===400);await m.assign(actor,id,null);assert.equal((await m.inbox(actor,new URLSearchParams({q:suffix,assigned:'UNASSIGNED'}))).total,1);
  for(let i=0;i<26;i++){const cid=randomBytes(16).toString('hex');await db.$executeRaw`INSERT INTO support_conversations (id,brand,customerId,ownerKind,requestKey,subject) VALUES (${cid},'SURE_IMPORTS',${customer.id},'CUSTOMER',${'pagination-'+i+suffix},${'Search '+suffix})`;}
  inbox=await m.inbox(actor,params);assert.equal(inbox.total,27);assert.equal(inbox.conversations.length,25);const second=await m.inbox(actor,new URLSearchParams({q:suffix,page:'2'}));assert.equal(second.conversations.length,2);assert.ok(second.conversations.every(row=>!inbox.conversations.some(prev=>prev.id===row.id)));
  assert.equal((await m.inbox(actor,new URLSearchParams({q:"' OR 1=1 --"}))).total,0);assert.equal((await m.inbox(actor,new URLSearchParams({q:suffix,unread:'true'}))).total,1);
  const reports=await m.reports(7);assert.ok(reports.summary.total>=27);assert.ok(reports.daily.length);assert.ok(reports.workload.some(a=>a.id===admin));assert.ok(!reports.workload.some(a=>a.id===excluded));assert.doesNotThrow(()=>JSON.stringify(reports));
  let editRequested=null;const http=management.managementEndpoints(db,async edit=>{editRequested=edit;return edit?null:{actor};});
  const request=(body)=>new Request('http://localhost/api/support/read',{method:'POST',headers:{origin:'http://localhost','content-type':'application/json'},body:JSON.stringify(body)});
  assert.equal((await http(request({cursor:first}),'read',id)).status,200);assert.equal(editRequested,false);assert.equal((await http(request({assignedTo:other}),'assign',id)).status,403);assert.equal(editRequested,true);
  assert.equal((await http(new Request('http://localhost/api/support/inbox?page=0'),'inbox')).status,400);assert.equal((await http(new Request('http://localhost/api/support/reports?days=1000'),'reports')).status,400);
  assert.equal((await http(new Request('http://localhost/api/support/read',{method:'POST',headers:{origin:'https://evil.test'},body:'{}'}),'read',id)).status,403);
  await db.$executeRaw`UPDATE support_notifications SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY)`;await db.$executeRaw`UPDATE support_notifications SET availableAt=NOW(3) WHERE conversationId=${id}`;
  const sent=[];let fail=true;const deliver=async n=>{if(n.to==='one-'+suffix+'@example.test' && fail)throw Error('temporary email failure');sent.push(n);};
  let result=await notices.deliverSupportNotifications(db,deliver);assert.equal(result.failed,1);assert.ok(sent.some(n=>n.to==='hello@sureimports.com'));assert.ok(sent.some(n=>n.to==='two-'+suffix+'@example.test'));assert.ok(!sent.some(n=>n.to==='excluded-'+suffix+'@example.test'));
  const count=sent.length;fail=false;await db.$executeRaw`UPDATE support_notifications SET availableAt=NOW(3) WHERE conversationId=${id}`;
  result=await notices.deliverSupportNotifications(db,deliver);assert.equal(result.failed,0);assert.equal(sent.length,count+1,'successful recipients are not resent after partial failure');assert.equal(sent.at(-1).to,'one-'+suffix+'@example.test');assert.ok(sent.every(n=>!JSON.stringify(n).includes('New message')));
 }finally{
  await db.$executeRaw`DELETE FROM admin_permissions WHERE pidUser IN (${admin},${other},${excluded})`;
  await db.$executeRaw`DELETE FROM admin WHERE pidUser IN (${admin},${other},${excluded})`;
  await db.$disconnect();
 }
});
