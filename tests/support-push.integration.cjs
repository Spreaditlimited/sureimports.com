const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), ts=require('typescript'), vm=require('node:vm');
const {PrismaClient}=require('@prisma/client');const {randomBytes}=require('node:crypto');
function load(path,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(id=>id==='server-only'?{}:id in deps?deps[id]:require(id),m,m.exports);return m.exports;}
const policy=load('lib/support/policy.ts'),pushPolicy=load('lib/support/push-policy.ts');
test('push endpoints reject internal networks, credentials, ports and deceptive suffixes',()=>{
 for(const endpoint of ['http://fcm.googleapis.com/test','https://localhost/test','https://127.0.0.1/test','https://fcm.googleapis.com.attacker.test/push','https://user:pass@fcm.googleapis.com/test','https://fcm.googleapis.com:444/test'])assert.equal(pushPolicy.trustedPushEndpoint(endpoint),false,endpoint);
 for(const endpoint of ['https://fcm.googleapis.com/fcm/send/test','https://updates.push.services.mozilla.com/wpush/v2/test','https://web.push.apple.com/test'])assert.equal(pushPolicy.trustedPushEndpoint(endpoint),true);
});
test('service worker shows generic content and constrains notification destinations',async()=>{
 const events={},shown=[],opened=[];
 const self={location:{origin:'https://admin.sureimports.com'},addEventListener:(name,fn)=>events[name]=fn,registration:{showNotification:async(...args)=>shown.push(args)},clients:{matchAll:async()=>[],openWindow:async url=>opened.push(url)}};
 vm.runInNewContext(fs.readFileSync('../admin.sureimports.com/public/support-sw.js','utf8'),{self,URL});
 let pending;events.push({data:{json:()=>({body:'PRIVATE CUSTOMER CONTENT',url:'https://attacker.test'})},waitUntil:p=>pending=p});await pending;
 assert.equal(shown.length,1);assert.ok(!JSON.stringify(shown).includes('PRIVATE CUSTOMER CONTENT'));
 events.notificationclick({notification:{data:{url:'//attacker.test'},close(){}},waitUntil:p=>pending=p});await pending;
 assert.equal(opened[0],'https://admin.sureimports.com/dashboard/support');
 const id='a'.repeat(32);events.notificationclick({notification:{data:{url:'/dashboard/support?conversation='+id},close(){}},waitUntil:p=>pending=p});await pending;assert.equal(opened[1],'https://admin.sureimports.com/dashboard/support?conversation='+id);
});
test('real MySQL: opted-in devices, coalescing, authorization, retries and expired endpoint cleanup',{skip:!process.env.SUPPORT_TEST_DATABASE_URL},async()=>{
 const url=new URL(process.env.SUPPORT_TEST_DATABASE_URL);assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'13317');assert.equal(url.pathname,'/support_pilot');
 const db=new PrismaClient({datasources:{db:{url:url.toString()}}});
 const {pushSubscriptions,deliverAdminPush}=load('lib/support/push-store.ts',{'./policy':policy,'./push-policy':pushPolicy});const subscriptions=pushSubscriptions(db);
 const store=load('lib/support/store.ts',{'./policy':policy}).supportStore(db);
 const suffix=randomBytes(8).toString('hex'),adminId='push-admin-'+suffix,otherAdmin='other-'+suffix;
 const actor={kind:'CUSTOMER',id:'push-customer-'+suffix,brand:'SURE_IMPORTS'},agent={kind:'AGENT',id:adminId,brand:'SUPPORT_TEAM'};
 const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/'+suffix,keys:{p256dh:'A'.repeat(87),auth:'B'.repeat(22)}};
 try{
  await db.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS admin (id INT AUTO_INCREMENT PRIMARY KEY,pidUser VARCHAR(191) UNIQUE,userStatus VARCHAR(191))');
  await db.$executeRawUnsafe('CREATE TABLE IF NOT EXISTS admin_permissions (id INT AUTO_INCREMENT PRIMARY KEY,pidUser VARCHAR(191),serviceKey VARCHAR(100),canView BOOLEAN,canEdit BOOLEAN)');
  await db.$executeRaw`INSERT INTO admin (pidUser,userStatus) VALUES (${adminId},'L2'),(${otherAdmin},'L2')`;
  await db.$executeRaw`INSERT INTO admin_permissions (pidUser,serviceKey,canView,canEdit) VALUES (${adminId},'customer_support',TRUE,FALSE)`;
  const device=await subscriptions.subscribe(adminId,subscription);assert.equal(await subscriptions.status(adminId,subscription.endpoint),true);assert.equal(await subscriptions.status(otherAdmin,subscription.endpoint),false);
  assert.equal(await subscriptions.subscribe(adminId,subscription),device);
  await assert.rejects(subscriptions.subscribe(otherAdmin,subscription),e=>e.status===409);
  const id=await store.create(actor,{requestKey:'push-create-'+suffix,subject:'Private order question',body:'Private message text'},null);
  await store.send(actor,id,{requestKey:'push-followup-'+suffix,body:'One more detail',internal:false});
  await store.send(agent,id,{requestKey:'push-internal-'+suffix,body:'Internal only',internal:true});
  const [job]=await db.$queryRaw`SELECT revision FROM support_push_deliveries WHERE conversationId=${id} AND subscriptionId=${device}`;assert.equal(job.revision,2);
  await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=DATE_ADD(NOW(3),INTERVAL 1 DAY) WHERE subscriptionId<>${device}`;
  await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=NOW(3) WHERE subscriptionId=${device}`;
  const sent=[];const result=await deliverAdminPush(db,async(s,p)=>sent.push({s,p}));assert.equal(result.delivered,1);assert.equal(sent[0].p.url,'/dashboard/support?conversation='+id);assert.ok(!JSON.stringify(sent[0].p).includes('Private'));
  await store.send(actor,id,{requestKey:'push-revoked-'+suffix,body:'Another message',internal:false});
  await db.$executeRaw`UPDATE admin_permissions SET canView=FALSE WHERE pidUser=${adminId}`;
  await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=NOW(3) WHERE subscriptionId=${device}`;
  assert.equal((await deliverAdminPush(db,async()=>{throw Error('permission revoked')})).skipped,1);
  await db.$executeRaw`UPDATE admin_permissions SET canView=TRUE WHERE pidUser=${adminId}`;
  await store.send(actor,id,{requestKey:'push-retry-'+suffix,body:'Retry test',internal:false});
  await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=NOW(3) WHERE subscriptionId=${device}`;
  assert.equal((await deliverAdminPush(db,async()=>{throw Object.assign(Error('provider down'),{statusCode:503})})).failed,1);
  const [retry]=await db.$queryRaw`SELECT attempts,leaseToken FROM support_push_deliveries WHERE subscriptionId=${device}`;assert.equal(retry.attempts,1);assert.equal(retry.leaseToken,null);
  await db.$executeRaw`UPDATE support_push_deliveries SET availableAt=NOW(3) WHERE subscriptionId=${device}`;
  assert.equal((await deliverAdminPush(db,async()=>{throw Object.assign(Error('expired'),{statusCode:410})})).skipped,1);assert.equal(await subscriptions.status(adminId,subscription.endpoint),false);
  await subscriptions.subscribe(adminId,subscription);await subscriptions.unsubscribe(otherAdmin,subscription.endpoint);assert.equal(await subscriptions.status(adminId,subscription.endpoint),true);await subscriptions.unsubscribe(adminId,subscription.endpoint);assert.equal(await subscriptions.status(adminId,subscription.endpoint),false);
 }finally{await db.$disconnect();}
});
