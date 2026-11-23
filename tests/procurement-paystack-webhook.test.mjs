import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {registerHooks} from 'node:module';
process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY='synthetic-webhook-secret';
const f={calls:[],fail:false,legacy:false};globalThis.__procWebhook=f;
const source=fs.readFileSync(new URL('../app/api/intelligence/paystack-webhook/route.ts',import.meta.url),'utf8');
const exportsByModule=new Map([...source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](@\/[^'"]+)['"]/g)].map(m=>[m[2],m[1].split(',').map(s=>s.trim()).filter(Boolean)]));
const inline=s=>({url:'data:text/javascript,'+encodeURIComponent(s),shortCircuit:true});
const hook=registerHooks({resolve(s,c,n){
 if(s==='next/server')return inline('export const NextResponse=Response;export const after=()=>{}');
 if(s==='@/lib/procurement/paystackCheckout')return inline('export const findProcurementCheckout=async()=>globalThis.__procWebhook.legacy?null:{};export const settleProcurementCheckout=async(r,p)=>{globalThis.__procWebhook.calls.push({r,p});if(globalThis.__procWebhook.fail)throw Error("synthetic DB outage");return {status:"PAID"}}');
 if(s==='@/app/api/paystack-payment/procurement/route')return inline('export const POST=async()=>Response.json({status:"success"})');
 if(exportsByModule.has(s))return inline(exportsByModule.get(s).map(name=>`export const ${name}=()=>{};`).join(''));
 return n(s,c);
}});
const {POST}=await import('../app/api/intelligence/paystack-webhook/route.ts');hook.deregister();
const body=JSON.stringify({event:'charge.success',data:{reference:'PROCPAY_synthetic',status:'success',amount:5000000,currency:'NGN',metadata:{service_id:'order',consumer_id:'user',service_name:'PROCUREMENT'}}});
function send(signature){return POST(new Request('https://sureimports.test/api/webhooks/paystack',{method:'POST',headers:{'x-paystack-signature':signature},body}));}
const signature=crypto.createHmac('sha512',process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY).update(body).digest('hex');
test('forged procurement event cannot reach settlement',async()=>{assert.equal((await send('forged')).status,401);assert.equal(f.calls.length,0);});
test('signed success settles without a customer browser callback',async()=>{assert.equal((await send(signature)).status,200);assert.equal(f.calls[0].r,'PROCPAY_synthetic');assert.equal(f.calls[0].p.amount,5000000);});
test('database outage returns a retryable error to Paystack',async()=>{f.fail=true;assert.equal((await send(signature)).status,503);f.fail=false;assert.equal((await send(signature)).status,200);});
test('pre-release checkouts retain a verified legacy settlement path',async()=>{f.legacy=true;assert.equal((await send(signature)).status,200);});
