import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function load(file, dependencies = {}) {
 const code = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const mod = {exports:{}};
 new Function('require','module','exports',code)(name => dependencies[name] ?? require(name),mod,mod.exports);
 return mod.exports;
}
const main = new URL('../lib/email/temp/mailTemplate2.ts',import.meta.url);
const template = load(main);
test('email keeps content, token links, branding and dark styles',()=>{
 const html=template.default({zTitle:'Verify & continue',zBodyTitle:'Hello <Ada>',zBody1:'<p>Code: 123456</p>',zBody2:'Expires in 10 minutes.',zButtonTitle:'Verify account',zButtonLink:'https://example.com/verify?token=abc&source=email',zFooter:'Unsubscribe: <a href="https://example.com/unsubscribe">here</a>'});
 for(const text of ['Hello &lt;Ada&gt;','123456','Expires in 10 minutes','token=abc&amp;source=email','Unsubscribe','prefers-color-scheme:dark','sureimports-logo-dark.png','max-width:560px','sureimports-email-design-v2']) assert.ok(html.includes(text),text);
 assert.equal((html.match(/<!doctype html>/g)||[]).length,1);
 assert.ok(!html.includes('width="680"'));
});
test('unsafe action URLs do not create a button',()=>{
 const html=template.default({zButtonTitle:'Click',zButtonLink:'javascript:alert(1)'});
 assert.ok(!html.includes('href="javascript:'));
 assert.ok(!html.includes('>Click</a>'));
});
test('storefront branding is retained',()=>{
 const html=template.default({zBrandName:'Acme & Co',zSupportEmail:'help@example.com'});
 assert.ok(html.includes('Acme &amp; Co'));
 assert.ok(html.includes('mailto:help@example.com'));
});
test('every server uses the same design', {skip: !['admin.sureimports.com','partner.sureimports.com','affiliate.sureimports.com','linescout'].every(name=>fs.existsSync(new URL(`../../${name}`,import.meta.url)))},()=>{
 const source=fs.readFileSync(main,'utf8');
 for(const path of ['admin.sureimports.com/lib/email/temp/mailTemplate2.ts','partner.sureimports.com/lib/email/temp/mailTemplate2.ts','affiliate.sureimports.com/lib/email/template.ts','linescout/lib/email-template.ts']) assert.equal(fs.readFileSync(new URL(`../../${path}`,import.meta.url),'utf8'),source,path);
});
test('completion email carries the correct review link and escapes customer content', {skip: !fs.existsSync(new URL('../../admin.sureimports.com/lib/procurement/reviewEmail.ts',import.meta.url))},()=>{
 const review=load(new URL('../../admin.sureimports.com/lib/procurement/reviewEmail.ts',import.meta.url),{'@/lib/prisma':{prisma:{}},'@/lib/email/config/nodemailerConfig':{default:{}},'@/lib/email/temp/mailTemplate2':template});
 const email=review.completedOrderEmail({firstName:'<Ada>',pidOrder:'DR123',orderName:'Office & laptops',note:'Delivered <today>'});
 assert.ok(email.html.includes('Hi &lt;Ada&gt;'));
 assert.ok(email.html.includes('Office &amp; laptops'));
 assert.ok(email.html.includes('Delivered &lt;today&gt;'));
 assert.ok(email.html.includes(review.GOOGLE_REVIEW_URL));
 assert.ok(email.text.includes('DR123'));
 assert.ok(email.text.includes(review.GOOGLE_REVIEW_URL));
});
