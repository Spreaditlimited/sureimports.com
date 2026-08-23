const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken =
  process.env.CLOUDFLARE_STREAM_API_TOKEN || process.env.CF_API_TOKEN;

if (!accountId) throw new Error('Missing CLOUDFLARE_ACCOUNT_ID');
if (!apiToken) throw new Error('Missing CLOUDFLARE_STREAM_API_TOKEN');

const apiBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`;
const videoName = 'Hytera Body Camera Promotion Video';
const sourceUrl =
  'https://res.cloudinary.com/djprcwnsz/video/upload/sureimports/body-camera-solutions/video/hytera-body-camera-promotion-video.mp4';

const headers = {
  Authorization: `Bearer ${apiToken}`,
  'Content-Type': 'application/json',
};

async function cloudflare(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    const message = payload.errors?.map((error) => error.message).join('; ');
    throw new Error(
      message || `Cloudflare Stream request failed (${response.status})`,
    );
  }

  return payload.result;
}

async function main() {
  const existing = await cloudflare(
    `?search=${encodeURIComponent(videoName)}&limit=10`,
  );
  const matchingVideo = existing.find(
    (video) => video.meta?.name === videoName,
  );

  if (matchingVideo) {
    console.log(
      JSON.stringify({
        uid: matchingVideo.uid,
        state: matchingVideo.status?.state,
        existing: true,
      }),
    );
    return;
  }

  const video = await cloudflare('/copy', {
    method: 'POST',
    body: JSON.stringify({
      input: sourceUrl,
      name: videoName,
      meta: {
        name: videoName,
        source: 'Sure Imports body camera solutions',
      },
      requireSignedURLs: false,
      allowedOrigins: [
        'sureimports.com',
        'www.sureimports.com',
        'localhost:3000',
        'localhost:3001',
        '127.0.0.1:3000',
        '127.0.0.1:3001',
      ],
      thumbnailTimestampPct: 0.2,
    }),
  });

  console.log(
    JSON.stringify({
      uid: video.uid,
      state: video.status?.state,
      existing: false,
    }),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
