const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const {PrismaClient}=require('@prisma/client');const {randomBytes}=require('node:crypto');
function load(path,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(id=>id==='server-only'?{}:id in deps?deps[id]:require(id),m,m.exports);return m.exports;}
const policy=load('lib/support/policy.ts'),rules=load('lib/support/attachment-policy.ts',{'./policy':policy}),storeModule=load('lib/support/store.ts',{'./policy':policy});
const pdf=Buffer.from('%PDF-1.4\nLocal attachment test\n%%EOF');
test('attachment policy validates signatures, size, filenames and retention',()=>{
 assert.equal(rules.inspectAttachment(pdf,'../<test>\r\n.html').name,'test.pdf');
 assert.throws(()=>rules.inspectAttachment(Buffer.from('<script>bad</script>'),'photo.png'),e=>e.status===415);
 assert.throws(()=>rules.inspectAttachment(Buffer.alloc(rules.attachmentLimit+1),'big.pdf'),e=>e.status===413);
 assert.throws(()=>rules.inspectAttachment(Buffer.alloc(0),'empty.pdf'),e=>e.status===413);
 process.env.SUPPORT_ATTACHMENT_RETENTION_DAYS='7';assert.equal(rules.retentionDays(),7);process.env.SUPPORT_ATTACHMENT_RETENTION_DAYS='0';assert.equal(rules.retentionDays(),30);delete process.env.SUPPORT_ATTACHMENT_RETENTION_DAYS;
});
test('attachment authorization, retries, internal notes, expiry and actual storage deletion calls',{skip:!process.env.SUPPORT_TEST_DATABASE_URL},async()=>{
 const url=new URL(process.env.SUPPORT_TEST_DATABASE_URL);assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'13317');assert.equal(url.pathname,'/support_pilot');
 const db=new PrismaClient({datasources:{db:{url:url.toString()}}}),store=storeModule.supportStore(db),objects=new Map(),removed=[];
 const storage={upload:async(asset,bytes)=>objects.set(asset,bytes),download:async asset=>new Response(objects.get(asset)).body,remove:async asset=>{removed.push(asset);objects.delete(asset);}};
 const http=load('lib/support/attachment-http.ts',{'./policy':policy,'./store':storeModule,'./attachment-policy':rules,'./attachment-storage':{attachmentStorage:storage}});
 const suffix=randomBytes(8).toString('hex'),customer={kind:'CUSTOMER',brand:'SURE_IMPORTS',id:'file-'+suffix},agent={kind:'AGENT',brand:'SUPPORT_TEAM',id:'file-agent-'+suffix};
 let actor=customer;const api=http.attachmentEndpoints(db,async()=>actor?{actor}:null,storage);
 const request=(key,internal=false,bytes=pdf)=>new Request('http://localhost/api/support/files',{method:'POST',headers:{origin:'http://localhost','x-request-key':key,'x-file-name':'receipt.pdf','x-internal-note':String(internal)},body:bytes});
 const get=()=>new Request('http://localhost/api/support/files');
 process.env.SUPPORT_CHAT_ENABLED='true';
 try{
  const id=await store.create(customer,{requestKey:'create-file-'+suffix,subject:'Attachment QA',body:'Please check my receipt'},null),key='upload-file-'+suffix;
  actor=null;assert.equal((await api(request(key),id)).status,403);actor={...customer,id:'stranger'};assert.equal((await api(request(key),id)).status,404);actor=customer;
  assert.equal((await api(new Request('http://localhost/api/support/files',{method:'POST',headers:{origin:'https://other.test'},body:pdf}),id)).status,403);
  assert.equal((await api(request(key,true),id)).status,403);
  assert.equal((await api(request(key),id)).status,200);
  assert.equal((await api(request(key),id)).status,200);
  let history=await store.history(customer,id,0);assert.equal(history.messages.length,2);const file=history.messages.at(-1);assert.equal(file.attachmentName,'receipt.pdf');assert.ok(file.attachmentExpiresAt);assert.equal(objects.size,1);assert.equal(removed.length,1);
  let response=await api(get(),id,String(file.id));assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/octet-stream');assert.equal(await response.text(),pdf.toString());
  actor={...customer,brand:'LINESCOUT'};assert.equal((await api(get(),id,String(file.id))).status,404);
  actor=agent;assert.equal((await api(request('private-file-'+suffix,true),id)).status,200);const note=(await store.history(agent,id,0)).messages.at(-1);
  actor=customer;assert.equal((await api(get(),id,String(note.id))).status,404);assert.equal((await store.history(customer,id,0)).messages.length,2);
  const [row]=await db.$queryRaw`SELECT attachmentAsset FROM support_messages WHERE id=${file.id}`;
  await db.$executeRaw`UPDATE support_files SET expiresAt=DATE_SUB(NOW(3),INTERVAL 1 SECOND) WHERE asset=${row.attachmentAsset}`;
  assert.equal((await api(get(),id,String(file.id))).status,410);
  const failed=await http.cleanupAttachments(db,{...storage,remove:async()=>{throw Error('provider down')}});assert.ok(failed.failed>=1);assert.ok(objects.has(row.attachmentAsset));
  const cleaned=await http.cleanupAttachments(db,storage);assert.ok(cleaned.deleted>=1);assert.ok(!objects.has(row.attachmentAsset));assert.equal((await api(get(),id,String(file.id))).status,410);
  history=await store.history(customer,id,0);assert.equal(history.messages.at(-1).attachmentName,'receipt.pdf');assert.equal(history.messages.at(-1).attachmentExpiresAt,null);
  process.env.SUPPORT_CHAT_ENABLED='false';assert.equal((await api(get(),id,String(file.id))).status,404);
 }finally{process.env.SUPPORT_CHAT_ENABLED='true';await db.$disconnect();}
});
