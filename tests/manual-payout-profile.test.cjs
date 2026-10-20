const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
function load(file, deps={}) { const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText; const m={exports:{}}; new Function('require','module','exports',code)(name=>name in deps ? deps[name] : require(name),m,m.exports);return m.exports; }
const policy=load('lib/payouts/profile.ts');
const paypal={method:'PAYPAL_MANUAL',accountName:'Test Customer',paypalEmail:'TEST@example.com',confirmedOwnAccount:true};
const bank={method:'UK_BANK',accountName:'Test Customer',bankName:'Test Bank',accountNumber:'00123456',bankCode:'12-34-56',confirmedOwnAccount:true};
test('payout validation normalizes email and sort code without stripping leading zeroes',()=>{
 assert.equal(policy.payoutProfileSchema.parse(paypal).paypalEmail,'test@example.com');
 const parsed=policy.payoutProfileSchema.parse(bank);assert.equal(parsed.bankCode,'123456');assert.equal(parsed.accountNumber,'00123456');
 for(const bad of [{...paypal,paypalEmail:'bad'},{...bank,accountNumber:'1234567'},{...bank,bankCode:'12345'},{...paypal,confirmedOwnAccount:false},{...paypal,verified:true}]) assert.equal(policy.payoutProfileSchema.safeParse(bad).success,false);
 assert.throws(()=>policy.validatePayoutCountry(bank,'France'));
 assert.throws(()=>policy.validatePayoutCountry(paypal,'Nigeria'));
 assert.throws(()=>policy.validatePayoutCountry(paypal,null));
 assert.doesNotThrow(()=>policy.validatePayoutCountry(bank,'United Kingdom'));
 assert.ok(!policy.maskedPayout(policy.payoutProfileSchema.parse(bank)).includes('00123456'));
});
test('email challenge is owner-bound, rate limited, consumed once and saves only frozen details',async()=>{
 let row, country='United Kingdom', sentCode, emailCount=0;
 const tx={
  $queryRaw:async(strings)=>strings.join('').includes('FROM users') ? [{country}] : row ? [row] : [],
  $executeRaw:async(strings,...v)=>{const sql=strings.join('?');if(sql.startsWith('INSERT IGNORE')) row ||= {revision:0,challengeJson:null,destinationCiphertext:null};else if(sql.includes('SET challengeJson=')) row.challengeJson=v[0];else if(sql.includes('SET destinationCiphertext=')){row.destinationCiphertext=v[0];row.country=v[1];row.revision++;row.challengeJson=v[2];}return 1;},
 };
 const prisma={...tx,users:{findUnique:async()=>({country})},$transaction:async fn=>fn(tx)};
 const api=load('app/api/account/payout-details/route.ts',{
  '@/lib/prisma':{prisma},'@/lib/auth/current-user':{currentUser:async()=>({pidUser:'owner',userEmail:'owner@example.com'})},
  '@/lib/features/country':{normalizeAccountCountry:v=>v},'@/lib/payouts/profile':policy,
  '@/lib/refunds/destination':{protectRefundDestination:(data,id)=>JSON.stringify({data,id}),readRefundDestination:(text)=>JSON.parse(text).data},
  '@/lib/banking/verification':{codeDigest:(owner,nonce,code)=>`${owner}:${nonce}:${code}`},
  '@/lib/email/xMail':{default:async args=>{assert.equal(args.xEmail,'owner@example.com');sentCode=args.xBody1.match(/<strong>(\d+)/)[1];emailCount++;}},
 });
 const request=body=>new Request('https://sureimports.com/api/account/payout-details',{method:'POST',headers:{origin:'https://sureimports.com','Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await api.POST(request({action:'request-code',profile:paypal,pidUser:'attacker'}))).status,200);
 assert.equal((await api.POST(request({action:'request-code',profile:bank}))).status,429);assert.equal(emailCount,1);
 const wrong=sentCode==='000000'?'111111':'000000';
 assert.equal((await api.POST(request({action:'confirm',code:wrong}))).status,400);
 assert.equal(JSON.parse(row.challengeJson).attempts,1);
 assert.equal((await api.POST(request({action:'confirm',code:sentCode,profile:bank}))).status,200);
 assert.equal(JSON.parse(row.destinationCiphertext).data.method,'PAYPAL_MANUAL');
 assert.equal(JSON.parse(row.destinationCiphertext).id,'payout-profile:owner');
 assert.equal((await api.POST(request({action:'confirm',code:sentCode}))).status,400);
 const data=await (await api.GET()).json();assert.ok(data.profile.summary);assert.equal(data.profile.paypalEmail,undefined);
 country='France';assert.equal((await (await api.GET()).json()).profile.needsUpdate,true);
});
test('manual completion checks locked amount, status, original provider legs and destination review',async()=>{
 let method='PAYPAL_MANUAL',status='REQUESTED',legs=[],writes=0;
 const tx={$queryRaw:async strings=>{
  const sql=strings.join('');
  if(sql.includes('refund_records')) return [{pidUser:'owner',amount:'100.00',currency:'USD',refundStatus:'requested'}];
  if(sql.includes('refund_provider_legs')) return legs;
  return [{sourceAmount:'100.00',sourceCurrency:'USD',settlementAmount:'80.00',settlementCurrency:'GBP',method,status}];
 },$executeRaw:async()=>{writes++;},refund_records:{update:async()=>{writes++;}}};
 const {confirmForeignBankRefund}=load('../admin.sureimports.com/lib/refunds/settle-bank.ts',{'server-only':{},'@/lib/prisma':{prisma:{$transaction:async f=>f(tx)}},'./money':load('lib/refunds/money.ts')});
 const input={refundId:'r1',reference:'PAYPAL-TXN-1',adminId:'admin',confirmedAmount:'80.00',confirmedCurrency:'GBP',destinationVerified:true};
 await assert.rejects(()=>confirmForeignBankRefund({...input,destinationVerified:false}));
 await assert.rejects(()=>confirmForeignBankRefund({...input,confirmedAmount:'79.99'}));
 await assert.rejects(()=>confirmForeignBankRefund({...input,confirmedCurrency:'USD'}));
 method='PAYPAL';await assert.rejects(()=>confirmForeignBankRefund(input));method='PAYPAL_MANUAL';
 status='SETTLED';await assert.rejects(()=>confirmForeignBankRefund(input));status='REQUESTED';
 legs=[{id:'existing'}];await assert.rejects(()=>confirmForeignBankRefund(input));legs=[];
 assert.equal(writes,0);assert.deepEqual(await confirmForeignBankRefund(input),{amount:'80.00',currency:'GBP'});assert.equal(writes,2);
});
test('stored payout destinations are authenticated ciphertext bound to their owner or refund',()=>{
 const old=process.env.AFFILIATE_SECURITY_KEY;
 process.env.AFFILIATE_SECURITY_KEY=Buffer.alloc(32,7).toString('base64');
 try {
  const crypto=load('lib/refunds/destination.ts',{'server-only':{}});
  const envelope=crypto.protectRefundDestination(paypal,'payout-profile:one');
  assert.ok(!envelope.includes('example.com'));
  assert.equal(crypto.readRefundDestination(envelope,'payout-profile:one').paypalEmail,paypal.paypalEmail);
  assert.throws(()=>crypto.readRefundDestination(envelope,'payout-profile:two'));
  const parts=envelope.split('.');parts[1]=Buffer.alloc(16).toString('base64url');
  assert.throws(()=>crypto.readRefundDestination(parts.join('.'),'payout-profile:one'));
 } finally { if(old===undefined) delete process.env.AFFILIATE_SECURITY_KEY;else process.env.AFFILIATE_SECURITY_KEY=old; }
});
