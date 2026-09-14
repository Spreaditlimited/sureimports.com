import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
function load(file, dependencies={}) {
 const code=ts.transpileModule(fs.readFileSync(new URL('../lib/refunds/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const exports={};new Function('exports','require',code)(exports,id=>dependencies[id]);return exports;
}
const money=load('money.ts');
const {productPrincipalUsd,productRetentionRatio,commissionReduction}=load('components.ts',{'./money':money});
test('product principal excludes shipping, service charge and tax on the service charge',()=>{
 assert.equal(productPrincipalUsd('128','10','15','20'),100);
 assert.equal(productPrincipalUsd('126.125','10','15','7.5'),100);
});
test('shipping or fee-only reduction does not debit product commissions',()=>{
 assert.equal(productRetentionRatio(100,100),'1.00000000');
 assert.equal(commissionReduction('20','1.00000000'),'0.00');
 assert.equal(productRetentionRatio(100,110),'1.00000000');
});
test('successive product refunds reduce remaining earnings proportionally',()=>{
 const first=commissionReduction('20',productRetentionRatio(1000,800));
 assert.equal(first,'4.00');
 assert.equal(commissionReduction('16',productRetentionRatio(800,600)),'4.00');
 assert.equal(commissionReduction('12','0.00000000'),'12.00');
});
test('invalid source snapshots cannot produce a guessed correction',()=>{
 assert.throws(()=>productPrincipalUsd('10','20','15','20'));
 assert.throws(()=>productRetentionRatio(0,10));
 assert.throws(()=>commissionReduction('10','1.5'));
});
