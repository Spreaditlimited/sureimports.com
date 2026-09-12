import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('TikTok bootstrap declares the expected global and passes its pixel ID',()=>{
  const source=readFileSync(new URL('../app/(home)/components/TrackingPixels.tsx',import.meta.url),'utf8');
  const script=source.match(/!function \(w, d, t\) \{[\s\S]*?\}\(window, document, 'script'\);/)?.[0];
  assert.ok(script);
  const window={};const inserted=[];
  const document={createElement:()=>({}),getElementsByTagName:()=>[{parentNode:{insertBefore:s=>inserted.push(s)}}]};
  runInNewContext(script.replace('${TT_ID}','fixture-pixel'),{window,document});
  assert.equal(window.TiktokAnalyticsObject,'ttq');
  assert.ok(window[window.TiktokAnalyticsObject]);
  assert.equal(new URL(inserted[0].src).searchParams.get('sdkid'),'fixture-pixel');
  assert.equal(new URL(inserted[0].src).searchParams.get('lib'),'ttq');
});
