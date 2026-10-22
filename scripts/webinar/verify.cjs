const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
function load(path, deps={}) { const m={exports:{}};const js=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;new Function('require','module','exports',js)(name=>deps[name]||require(name),m,m.exports);return m.exports; }
const content=load('lib/webinar/content.ts');
for(const account of [true,false]) for(const watched of [true,false]) {
 const msg=content.webinarWelcome(account,watched,!account);
 assert.ok(msg.bodyText.includes('apps.apple.com/app/id507097717'));
 assert.ok(msg.bodyText.includes('com.alibaba.wireless'));
 assert.ok(msg.bodyText.includes('Google Chrome'));
 assert.equal(msg.bodyText.includes('each week'),!account);
 assert.equal(msg.ctaLabel,watched?(account?'Start Your Order':'Revisit the Webinar'):'Watch the Free Webinar');
 if(watched) assert.ok(!msg.bodyText.includes('If you haven’t watched'));
}
const progress=load('lib/webinar/progress.ts',{'./content':content});
const bins=new Set();
progress.recordWatchedInterval(bins,0,600,6);assert.equal(bins.size,0,'Seeking must not count');
progress.recordWatchedInterval(bins,0,6,6);assert.equal(bins.size,6);
progress.recordWatchedInterval(bins,0,6,6);assert.equal(bins.size,6,'Rewatching must not double-count');
progress.recordWatchedInterval(bins,6,6,60);assert.equal(bins.size,6,'Pausing must not count');
console.log('Passed: four email segments, app links, consent wording, seek/pause/replay protection.');
