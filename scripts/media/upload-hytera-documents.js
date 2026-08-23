const path = require('node:path');
const { v2: cloudinary } = require('cloudinary');

for (const name of [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sourceDirectory =
  process.env.HYTERA_DOCUMENT_SOURCE_DIRECTORY ||
  path.join(require('node:os').homedir(), 'Downloads', 'Hytera Body Camera');

const documents = [
  {
    source: path.join(
      sourceDirectory,
      'Hytera BodyCam & Pltaform_Product Catalog.pdf',
    ),
    publicId:
      'sureimports/body-camera-solutions/documents/hytera-body-camera-product-solution-catalogue-2026.pdf',
  },
  {
    source: path.join(
      sourceDirectory,
      'Hytera Digital Evidence Management System_Product Description V5.4.pdf',
    ),
    publicId:
      'sureimports/body-camera-solutions/documents/hytera-digital-evidence-management-product-description-v5-4.pdf',
  },
];

async function main() {
  const uploaded = [];

  for (const document of documents) {
    const result = await cloudinary.uploader.upload(document.source, {
      public_id: document.publicId,
      resource_type: 'raw',
      overwrite: true,
      invalidate: true,
      use_filename: false,
      unique_filename: false,
      tags: ['sureimports', 'hytera', 'body-camera-solutions', 'document'],
    });

    uploaded.push({
      publicId: result.public_id,
      url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
    });
  }

  console.log(JSON.stringify(uploaded, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
