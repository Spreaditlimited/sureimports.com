const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
const layouts = require('../lib/shop/phone-image-layouts.json');

function loadImage() {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync('components/shop/ProductImage.tsx','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  vm.runInNewContext(code,{exports,require(id){
    if(id.endsWith('.module.css')) return {__esModule:true,default:new Proxy({},{get:(_,key)=>String(key)})};
    if(id==='lucide-react') return {Package:()=>React.createElement('svg',{'aria-hidden':true})};
    if(id.includes('phone-image-layouts')) return layouts;
    return require(id);
  }});
  return exports.default;
}
test('all measured phone layouts stay within their original source image',()=>{
  assert.ok(Object.keys(layouts).length > 100);
  for(const [key,[x,y,w,h,sw,sh]] of Object.entries(layouts)) {
    assert.ok(x>=0 && y>=0 && w>0 && h>0 && x+w<=sw && y+h<=sh,key);
  }
});
test('every measured phone renders without conflicting Next Image fill dimensions',()=>{
  const ProductImage=loadImage();
  for(const key of Object.keys(layouts)) {
    const html=renderToStaticMarkup(React.createElement(ImageConfigContext.Provider,{value:{...imageConfigDefault,remotePatterns:[{protocol:'https',hostname:'res.cloudinary.com',pathname:'/**'}]}},React.createElement(ProductImage,{src:`https://res.cloudinary.com/djprcwnsz/image/upload/${key}`,alt:'Phone'})));
    assert.match(html,/phoneCrop/);
    assert.match(html,/alt="Phone"/);
  }
});
test('unmeasured non-phone images retain the original contain presentation',()=>{
  const ProductImage=loadImage();
  const html=renderToStaticMarkup(React.createElement(ProductImage,{src:'/images/shop-placeholder.svg',alt:'Laptop'}));
  assert.match(html,/uncropped/);
  assert.doesNotMatch(html,/phoneCrop/);
});
test('missing images still have an accessible fallback',()=>{
  const ProductImage=loadImage();
  assert.match(renderToStaticMarkup(React.createElement(ProductImage,{src:'',alt:'Phone'})),/Image unavailable/);
});
