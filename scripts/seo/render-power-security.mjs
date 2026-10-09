import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
const out=process.argv[2]||'deliverables/seo-power-security-2026-10-09';
const m=JSON.parse(await fs.readFile(`${out}/release.json`,'utf8'));
const profile=`/private/tmp/sureimports-cdp-${Date.now()}`;
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless','--disable-gpu','--no-first-run',`--user-data-dir=${profile}`,'--remote-debugging-port=0','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ws;
try{
 let lines;
 for(let i=0;i<100;i++){try{lines=(await fs.readFile(`${profile}/DevToolsActivePort`,'utf8')).trim().split('\n');break;}catch{await sleep(100);}}
 if(!lines)throw Error('Chrome debugging endpoint did not start');
 ws=new WebSocket(`ws://127.0.0.1:${lines[0]}${lines[1]}`);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let id=0;const pending=new Map();ws.onmessage=e=>{const p=JSON.parse(e.data);if(p.id&&pending.has(p.id)){const {resolve,reject,timer}=pending.get(p.id);clearTimeout(timer);pending.delete(p.id);p.error?reject(Error(JSON.stringify(p.error))):resolve(p.result);}};
 const send=(method,params={},sessionId)=>new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(Error(`CDP timeout: ${method}`));},20000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params,sessionId}));});
 for(const c of m.changes){
  const {targetId}=await send('Target.createTarget',{url:'about:blank'});const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
  await send('Page.enable',{},sessionId);await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1050,deviceScaleFactor:1,mobile:false},sessionId);
  await send('Page.navigate',{url:`https://www.sureimports.com/blog/${c.after.blogSlug}`},sessionId);
  let html='';
  for(let i=0;i<20;i++){await sleep(1000);const data=await send('Runtime.evaluate',{expression:'document.documentElement.outerHTML',returnByValue:true},sessionId);html=data.result.value||'';if(html.includes('id="article-jsonld"'))break;}
  await fs.writeFile(`${out}/${c.key}-rendered.html`,html);
  if(!html.includes('id="article-jsonld"'))throw Error(`${c.key}: article JSON-LD not rendered`);
  await send('Runtime.evaluate',{expression:`Promise.all(Array.from(document.images).filter(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0;}).map(img=>img.complete?Promise.resolve(img.naturalWidth>0):new Promise(resolve=>{img.addEventListener('load',()=>resolve(true),{once:true});img.addEventListener('error',()=>resolve(false),{once:true});setTimeout(()=>resolve(false),15000);})))`,awaitPromise:true,returnByValue:true},sessionId).then(r=>{if(r.result.value?.some(v=>!v))throw Error(`${c.key}: visible image failed to load`);});
  const png=await send('Page.captureScreenshot',{format:'png'},sessionId);await fs.writeFile(`${out}/${c.key}-desktop.png`,Buffer.from(png.data,'base64'));
  await send('Runtime.evaluate',{expression:'document.querySelector("table")?.scrollIntoView(); window.scrollBy(0,-120);'},sessionId);
  const tablePng=await send('Page.captureScreenshot',{format:'png'},sessionId);await fs.writeFile(`${out}/${c.key}-table-desktop.png`,Buffer.from(tablePng.data,'base64'));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Runtime.evaluate',{expression:'document.querySelector("table")?.scrollIntoView(); window.scrollBy(0,-100);'},sessionId);
  await sleep(250);
  const dimensions=await send('Runtime.evaluate',{expression:'JSON.stringify({width:innerWidth,document:document.documentElement.scrollWidth})',returnByValue:true},sessionId);
  const mobile=await send('Page.captureScreenshot',{format:'png'},sessionId);await fs.writeFile(`${out}/${c.key}-table-mobile.png`,Buffer.from(mobile.data,'base64'));
  console.log(`${c.key}: author schema and desktop/mobile screenshots saved; ${dimensions.result.value}`);await send('Target.closeTarget',{targetId});
 }
}finally{ws?.close();child.kill('SIGKILL');}
