const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
function load(path,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(id=>id==='server-only'?{}:id in deps?deps[id]:require(id),m,m.exports);return m.exports;}
const policy=load('lib/website-videos/policy.ts'),meta=load('lib/website-videos/metadata.ts',{'./policy':policy});
test('YouTube links are normalized without accepting lookalikes, credentials or unrelated pages',()=>{
 for(const link of ['https://youtu.be/5nhM9Vv1V8M?si=FeX4IBSRcPG2nVK_','https://www.youtube.com/watch?v=5nhM9Vv1V8M&t=4','https://m.youtube.com/shorts/5nhM9Vv1V8M','https://www.youtube-nocookie.com/embed/5nhM9Vv1V8M'])assert.equal(policy.youtubeVideoId(link),'5nhM9Vv1V8M');
 for(const link of ['https://youtube.com.attacker.test/watch?v=5nhM9Vv1V8M','javascript:alert(1)','https://user:password@youtube.com/watch?v=5nhM9Vv1V8M','https://youtube.com/playlist?list=123','https://youtu.be/invalid','https://youtube.com:444/watch?v=5nhM9Vv1V8M'])assert.equal(policy.youtubeVideoId(link),null);
});
test('player metadata parsing respects escaped strings and rejects missing metadata',()=>{
 const player={videoDetails:{title:'Example }; with "quotes"',lengthSeconds:'808'}};
 assert.deepEqual(meta.parsePlayerResponse('<script>var ytInitialPlayerResponse = '+JSON.stringify(player)+';other();</script>'),player);
 assert.throws(()=>meta.parsePlayerResponse('consent page'));
});
test('video schema uses real publication details and an embed URL, never a watch URL as raw video content',()=>{
 const data={videoId:'5nhM9Vv1V8M',title:'Buying guide',description:'Steps for buying.',uploadDate:'2026-10-20T08:24:53-07:00',durationSeconds:808};
 assert.ok(policy.validVideoMetadata(data,data.videoId));assert.equal(policy.validVideoMetadata({...data,uploadDate:'unknown'},data.videoId),false);
 const schema=policy.videoSchema(data);assert.equal(schema.duration,'PT808S');assert.equal(schema.uploadDate,data.uploadDate);assert.equal(schema.contentUrl,undefined);assert.equal(schema.embedUrl,'https://www.youtube-nocookie.com/embed/5nhM9Vv1V8M');
});
test('stored video and SEO metadata update together and stale saves cannot overwrite another admin', {skip:!process.env.SUPPORT_TEST_DATABASE_URL},async()=>{
 const url=new URL(process.env.SUPPORT_TEST_DATABASE_URL);assert.equal(url.hostname,'127.0.0.1');assert.equal(url.port,'13317');assert.equal(url.pathname,'/support_pilot');
 const {PrismaClient}=require('@prisma/client');const db=new PrismaClient({datasources:{db:{url:url.toString()}}});
 const {websiteVideos,VideoSettingConflict}=load('lib/website-videos/store.ts',{'./policy':policy});const store=websiteVideos(db);
 const video={videoId:'5nhM9Vv1V8M',title:'Buying guide',description:'Steps for buying.',uploadDate:'2026-10-20T08:24:53-07:00',durationSeconds:808};
 try {
  const sql=fs.readFileSync('prisma/migrations/20261020170000_website_video_settings/migration.sql','utf8').replace('CREATE TABLE ','CREATE TABLE IF NOT EXISTS ');await db.$executeRawUnsafe(sql);
  assert.equal((await store.read()).revision,0);
  const saves=await Promise.allSettled([store.save('https://youtu.be/5nhM9Vv1V8M?si=test',0,'test-video-admin-a',video),store.save('https://youtu.be/5nhM9Vv1V8M',0,'test-video-admin-b',video)]);
  assert.equal(saves.filter(s=>s.status==='fulfilled').length,1);assert.ok(saves.find(s=>s.status==='rejected').reason instanceof VideoSettingConflict);
  const row=await store.read();assert.equal(row.videoUrl,'https://www.youtube.com/watch?v=5nhM9Vv1V8M');assert.equal(row.revision,1);assert.deepEqual(JSON.parse(row.metadataJson),video);
  await assert.rejects(store.save(row.videoUrl,1,'test-video-admin-a',{...video,videoId:'HJVlH0XT0ok'}));
 }finally {await db.$executeRaw`DELETE FROM website_video_settings WHERE updatedBy IN ('test-video-admin-a','test-video-admin-b')`;await db.$disconnect();}
});
test('admin endpoint enforces settings permissions, origin checks and link validation',async()=>{
 let allowed=false,calls=0;const store={read:async()=>{calls++;return {videoUrl:policy.defaultVideoUrl,revision:0}},save:async()=>{calls++;return {revision:1}}};
 const route=load('../admin.sureimports.com/app/api/website-videos/route.ts',{
  '@/app/api/_lib/adminAccess':{requireAdminServiceAccess:async()=>allowed?{ok:true,admin:{pidUser:'test-admin'}}:{ok:false,response:Response.json({}, {status:403})}},
  '@/lib/prisma':{prisma:{}},'@/lib/website-videos/policy':policy,'@/lib/website-videos/metadata':{fetchVideoMetadata:async()=>{throw Error('must not fetch invalid input')}},
  '@/lib/website-videos/store':{websiteVideos:()=>store,VideoSettingConflict:class extends Error{}}
 });
 assert.equal((await route.GET()).status,403);assert.equal(calls,0);
 allowed=true;assert.equal((await route.GET()).status,200);assert.equal(calls,1);
 const request=(origin,url)=>new Request('https://admin.sureimports.com/api/website-videos',{method:'PUT',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({videoUrl:url,revision:0})});
 assert.equal((await route.PUT(request('https://attacker.test','https://youtu.be/5nhM9Vv1V8M'))).status,403);
 assert.equal((await route.PUT(request('https://admin.sureimports.com','https://youtube.com.attacker.test/watch?v=5nhM9Vv1V8M'))).status,400);assert.equal(calls,1);
});

test('approved buying-guide thumbnail is used only for its matching video', () => {
 const thumbnail = policy.videoThumbnail('5nhM9Vv1V8M');
 assert.equal(thumbnail.url, 'https://www.sureimports.com/videos/buy-from-china-thumbnail.png');
 assert.ok(fs.existsSync('public/videos/buy-from-china-thumbnail.png'));
 assert.equal(policy.videoThumbnail('HJVlH0XT0ok').url, 'https://i.ytimg.com/vi/HJVlH0XT0ok/hqdefault.jpg');
 assert.equal(policy.videoSchema({...policy.defaultVideoMetadata,videoId:'5nhM9Vv1V8M'}).thumbnailUrl[0], thumbnail.url);
});
