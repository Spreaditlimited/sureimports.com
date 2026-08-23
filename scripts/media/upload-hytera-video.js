const path = require('node:path');
const { homedir } = require('node:os');
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

const source =
  process.env.HYTERA_VIDEO_SOURCE ||
  path.join(
    homedir(),
    'Downloads',
    'Hytera Body Camera',
    'Hytera Body Camera Promotion Video.mp4',
  );

async function main() {
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      source,
      {
        public_id:
          'sureimports/body-camera-solutions/video/hytera-body-camera-promotion-video',
        resource_type: 'video',
        overwrite: true,
        invalidate: true,
        use_filename: false,
        unique_filename: false,
        chunk_size: 20_000_000,
        tags: ['sureimports', 'hytera', 'body-camera-solutions', 'video'],
        context: {
          title: 'Hytera Body Camera Promotion Video',
          section: 'Body Camera Solutions',
        },
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      },
    );
  });

  console.log(
    JSON.stringify(
      {
        publicId: result.public_id,
        url: result.secure_url,
        bytes: result.bytes,
        duration: result.duration,
        width: result.width,
        height: result.height,
        format: result.format,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
