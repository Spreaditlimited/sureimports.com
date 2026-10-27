import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd(), false, {
  info() {},
  error() {},
});
const cloudinary = require('cloudinary').v2;
const root = 'deliverables/adsense-seo-repairs-2026-10-27';
const blogs = JSON.parse(fs.readFileSync(`${root}/before/blogs.json`, 'utf8'));
const assets = [
  [
    'quality-inspection',
    'quality-inspection-in-china-for-nigerian-importers-what-to-check-before-shipment',
  ],
  [
    'minimum-order-quantity',
    'moq-in-china-sourcing-how-nigerian-importers-should-handle-minimum-order-quantity',
  ],
  [
    'warehouse-receiving',
    'china-warehouse-receiving-for-nigerian-importers-what-happens-before-international-shipping',
  ],
  [
    'factory-holidays',
    'how-nigerian-importers-should-plan-around-chinese-holidays-and-factory-closures',
  ],
  [
    'bags-and-backpacks',
    'how-to-import-bags-and-backpacks-from-china-to-nigeria',
  ],
  [
    'kitchen-storage',
    'how-to-import-kitchen-and-home-storage-products-from-china-to-nigeria',
  ],
];
const manifestPath = `${root}/images/cloudinary-uploads.json`;
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : [];
if (process.argv.includes('--upload')) {
  for (const key of [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ])
    if (!process.env[key]) throw new Error(`Missing ${key}`);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}
for (const [name, slug] of assets) {
  const blog = blogs.find((b) => b.blogSlug === slug);
  if (!blog || blog.blogImage)
    throw new Error(`Refusing replacement of an existing image: ${slug}`);
  const file = path.resolve(`${root}/images/${name}.png`);
  if (!fs.existsSync(file)) throw new Error(`Missing generated asset ${name}`);
  if (!process.argv.includes('--upload')) {
    console.log(`Ready: ${name} → ${slug}`);
    continue;
  }
  if (manifest.some((row) => row.slug === slug)) {
    console.log(`Already uploaded: ${name}`);
    continue;
  }
  // Same upload_stream, folder and public-ID workflow used by the admin blog editor.
  // Unique IDs + overwrite:false preserve all owner-created assets.
  const upload = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'admin-sureimports/blog',
        public_id: `BLOG_REPAIR_${name}_20261027`,
        resource_type: 'image',
        overwrite: false,
        use_filename: false,
        unique_filename: false,
        tags: ['blog-feature', 'adsense-repair-20261027'],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(fs.readFileSync(file));
  });
  if (!upload.secure_url || !upload.public_id)
    throw new Error(`Upload failed for ${name}`);
  const response = await fetch(upload.secure_url, { method: 'HEAD' });
  if (
    !response.ok ||
    !response.headers.get('content-type')?.startsWith('image/')
  )
    throw new Error(`Image delivery failed for ${name}`);
  manifest.push({
    slug,
    pidBlog: blog.pidBlog,
    file,
    publicId: upload.public_id,
    url: upload.secure_url,
    width: upload.width,
    height: upload.height,
    bytes: upload.bytes,
    generatedWith: 'built-in image_gen',
    promptFile: `${name}-prompt.txt`,
    uploadedAt: new Date().toISOString(),
    verifiedStatus: response.status,
  });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(
    `Uploaded and verified: ${name} (${upload.width}×${upload.height})`,
  );
}
