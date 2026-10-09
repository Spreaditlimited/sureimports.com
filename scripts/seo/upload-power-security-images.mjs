import fs from 'node:fs/promises';
import {v2 as cloudinary} from 'cloudinary';
const out='deliverables/seo-power-security-2026-10-09';
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
let images={};try{images=JSON.parse(await fs.readFile(`${out}/images/upload-receipt.json`,'utf8'));}catch{}
for(const [key,file,slug] of [['generator','solar-generator.png','solar-generator-price-nigeria'],['cctv','cctv.png','how-to-import-cctv-and-security-gadgets-from-china-to-nigeria']]){
 if(images[key]){console.log(`${key}: uploaded already`);continue;}
 const uploaded=await cloudinary.uploader.upload(`${out}/images/${file}`,{folder:'admin-sureimports/blog',public_id:`BLOG_GEN_${slug}_${Date.now()}`,overwrite:false,resource_type:'image',tags:['blog','seo-power-security-2026-10-09']});
 images[key]={publicId:uploaded.public_id,url:uploaded.secure_url,width:uploaded.width,height:uploaded.height,bytes:uploaded.bytes};
 await fs.writeFile(`${out}/images/upload-receipt.json`,JSON.stringify(images,null,2));console.log(images[key]);
}
const before=JSON.parse(await fs.readFile(`${out}/before.json`,'utf8'));
const solar=before.find(x=>x.blogSlug.startsWith('how-to-import-solar-'));
const res=await fetch(`https://res.cloudinary.com/djprcwnsz/image/upload/${solar.blogImage}`);
if(!res.ok)throw Error('Existing solar image unavailable');
await fs.writeFile(`${out}/images/existing-solar.jpg`,Buffer.from(await res.arrayBuffer()));
