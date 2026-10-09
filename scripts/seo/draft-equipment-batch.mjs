import fs from 'node:fs/promises';
import {loadEnvFile} from 'node:process';
loadEnvFile('../admin.sureimports.com/.env.local');
const config=JSON.parse(await fs.readFile('scripts/seo/equipment-batch-config.json','utf8'));
const {out,contentFolder,topics}=config;const key=process.argv[2];const spec=topics[key];
if(!spec)throw Error('Choose packaging, salon, flour or palm');
const originals=JSON.parse(await fs.readFile(`${out}/before.json`,'utf8'));
const original=originals.find(x=>x.blogSlug===spec.slug);
const live=JSON.parse(await fs.readFile(`${out}/live-links.json`,'utf8'));
const related=live.filter(x=>/machine-sourcing|agro-processing|plantain-flour|rice-milling|furniture-from|supplier-verification|landed-cost-before|real-china-factory|generator-sizing|private-label-packaging/.test(x.slug));
const stateFile=`${out}/${key}-job.json`;let state;
try{state=JSON.parse(await fs.readFile(stateFile,'utf8'));}catch{}
const headers={Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'};
if(!state){
 const prompt=`Write a full, publishable Sure Imports article body: 2400–2900 useful words, HARD MINIMUM 2100. Author Tochukwu Nkwocha is supplied by site template; do NOT include a byline or H1 inside body. Title: ${spec.title}. Primary keyword: ${spec.keyword}. Specific brief: ${spec.brief}
 Research current primary sources with bounded web search. Date checked is 9 October 2026. Do not invent prices, quantities, case studies, exchange rates, legal rules, shipping timelines or our service promises. Nigerian retail prices are sourced dated examples, never a market range or endorsement. Link exact seller product pages beside price entries and explain included/excluded parts. If price evidence is weak, explicitly use quote required; do not fill a price-intent title with invented numbers. Manufacturer sources establish technical specs, not independent endorsements. Supplier capacity claims must be attributed and tested.
 No keyword stuffing, repeated conclusions or generic filler. Use practical decision tables, buyer checklists, explanatory paragraphs, explicitly hypothetical arithmetic and concise FAQs. Max 150 words derived from a single external source across entire article; no copied quotes. All external links from ORIGINAL must remain or be replaced with a researched, more relevant official source and recorded reasons. For generic unrelated NAFDAC links use a relevant SON official enquiry resource without legal applicability claims. Replace obsolete Customs URLs with current official homepage if needed. Do not prescribe customs, certification, tariffs or compliance: ask for exact-product assessment. No unsafe DIY instructions.
 Body HTML only p,h2,h3,strong,em,ul,ol,li,a,table,thead,tbody,tr,th,td; attributes only href on anchors. JSON output, not Markdown; no citation tokens. One primary CTA with contextual anchor to https://linescout.sureimports.com/sourcing-project?route_type=${spec.route}. At most three backup offers, only where useful: /supplier-intelligence, /buy-from-chinese-websites, /ship-with-us. Do not route normal SME buyers to Corporate Sourcing. Do not promise specific services, prices or outcomes beyond a sourcing enquiry.
 Include 3–5 natural editorial links chosen from these CONFIRMED LIVE articles: ${JSON.stringify(related)}. Prefix /blog/ to their slugs. Can also use /tools/landed-cost-estimator and /tools/cbm-volumetric-weight-calculator when relevant. Do not invent slugs or link other newly drafted batch articles. Preserve useful original content and exact topic scope. Replace old /source-products-from-china CTA with correct LineScout route, remove login/dashboard CTAs and generic link dumps. Explain local purchase vs import fairly.
 Return JSON object: {html,metaDescription (120–160 chars),focusKeyword,keywords (array),externalLinkChanges (array {originalUrl,action:retained|replaced,replacementUrl,reason}),sources (array {url,factsUsed}),appliedChanges (array)}.
 ORIGINAL ARTICLE: ${original?.blogContent||'No existing dedicated article. New buyer guide.'}`;
 await fs.writeFile(`${out}/${key}-prompt.txt`,prompt);
 const model=process.env.SEO_CONTENT_REWRITE_MODEL||'gpt-5.6-sol';
 const res=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{...headers,'Idempotency-Key':`${config.batch}-${key}`},body:JSON.stringify({model,background:true,reasoning:{effort:'high'},tools:[{type:'web_search'}],max_tool_calls:6,max_output_tokens:24000,input:[{role:'system',content:'You are a meticulous research editor. Return one JSON object only; write the complete article exceeding 2100 words with grounded research.'},{role:'user',content:prompt}]}),signal:AbortSignal.timeout(30000)});
 if(!res.ok)throw Error(`Start failed ${res.status}: ${(await res.text()).slice(0,400)}`);
 const data=await res.json();state={id:data.id,status:data.status,model,startedAt:new Date().toISOString(),spec};
 await fs.writeFile(stateFile,JSON.stringify(state,null,2),{flag:'wx'});console.log(JSON.stringify({key,id:state.id,status:state.status}));
}else{
 try{await fs.access(`${out}/${key}-draft.json`);console.log(`${key}: completed draft already saved; preserving edits`);process.exit(0);}catch{}
 const res=await fetch(`https://api.openai.com/v1/responses/${state.id}`,{headers,signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(`Poll failed ${res.status}`);
 const data=await res.json();state.status=data.status;await fs.writeFile(stateFile,JSON.stringify(state,null,2));
 if(data.status==='completed'){
  await fs.writeFile(`${out}/${key}-response.json`,JSON.stringify(data,null,2));
  const output=data.output.flatMap(x=>x.content||[]).map(x=>x.text||'').join('').replace(/^```json\s*|\s*```$/g,'');
  const draft=JSON.parse(output);await fs.writeFile(`${out}/${key}-draft.json`,JSON.stringify(draft,null,2));
  await fs.mkdir(contentFolder,{recursive:true});await fs.writeFile(`${contentFolder}/${key}.html`,draft.html.replaceAll('><','>\n<')+'\n',{flag:'wx'});
  console.log(JSON.stringify({key,status:data.status,words:draft.html.replace(/<[^>]*>/g,' ').trim().split(/\s+/).length,sources:draft.sources}));
 }else console.log(JSON.stringify({key,status:data.status,error:data.error}));
}
