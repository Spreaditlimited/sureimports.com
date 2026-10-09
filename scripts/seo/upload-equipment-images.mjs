import fs from 'node:fs/promises';
import {v2 as cloudinary} from 'cloudinary';
const {out,topics}=JSON.parse(await fs.readFile('scripts/seo/equipment-batch-config.json','utf8'));
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET});
let images={};try{images=JSON.parse(await fs.readFile(`${out}/images/upload-receipt.json`,'utf8'));}catch{}
for(const [key,spec] of Object.entries(topics)){
 if(images[key]){console.log(`${key}: already uploaded`);continue;}
 const r=await cloudinary.uploader.upload(`${out}/images/${key}.png`,{folder:'admin-sureimports/blog',public_id:`BLOG_GEN_${spec.slug}_${Date.now()}`,overwrite:false,resource_type:'image',tags:['blog','seo-equipment-2026-10-09']});
 images[key]={publicId:r.public_id,url:r.secure_url,width:r.width,height:r.height,bytes:r.bytes};
 await fs.writeFile(`${out}/images/upload-receipt.json`,JSON.stringify(images,null,2));console.log(JSON.stringify({key,...images[key]}));
}
