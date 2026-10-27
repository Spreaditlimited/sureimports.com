import fs from 'node:fs';
const dir = 'deliverables/china-import-stories/FCA-veo-test-v1';
const key = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '')
  .trim()
  .replace(/^["']|["']$/g, '');
const root = 'https://generativelanguage.googleapis.com/v1beta/';
const mode = process.argv[2] || 'status';
const prompt =
  'Animate the supplied cartoon illustration into one continuous eight-second shot. Preserve the exact hand-drawn colored-pencil style, adult factory worker in blue cap and shirt, opaque brown carton, white flatbed truck, factory background and all relative sizes. Fixed camera, full vehicle and worker stay within frame. The worker bends his knees and hips, reaches down with both hands and grips the sides of the carton on the ground. He smoothly straightens, visibly lifts the same solid carton with both hands, turns toward the flatbed and sets it down securely on top of the truck bed. His hands release only after the carton rests on the bed, then he withdraws both hands and stands back. Show continuous natural coordinated shoulder, elbow, wrist, hip and knee movement, a small step and believable weight. The box stays rigid and opaque; hands remain outside it. Finish with carton stationary on truck, worker on ground. Truck stays parked. No extra people, no additional boxes, no duplicated limbs, Quiet outdoor factory ambience accompanies the action. Do not pan or zoom.';
async function request(url, init = {}) {
  const r = await fetch(url, {
    ...init,
    headers: {
      'x-goog-api-key': key,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    signal: AbortSignal.timeout(60000),
  });
  const j = await r.json();
  if (!r.ok) {
    console.log(
      JSON.stringify({
        http: r.status,
        status: j.error?.status,
        message: j.error?.message?.replaceAll(key, '[REDACTED]'),
      }),
    );
    process.exit(1);
  }
  return j;
}
try {
  if (!key) throw new Error('No Gemini key');
  if (mode === 'start') {
    if (fs.existsSync(dir + '/Operation.json'))
      throw new Error(
        'Operation already saved; use status to avoid duplicate billing',
      );
    fs.writeFileSync(dir + '/Prompt.txt', prompt);
    const parameters = {
      aspectRatio: '9:16',
      resolution: '720p',
      durationSeconds: 8,
      sampleCount: 1,
      personGeneration: 'allow_adult',
    };
    fs.writeFileSync(
      dir + '/Request_Settings.json',
      JSON.stringify(
        {
          model: 'veo-3.1-fast-generate-preview',
          parameters,
          maxAttempts: 3,
          estimatedUSDPerSuccessfulAttempt: 0.8,
        },
        null,
        2,
      ),
    );
    const j = await request(
      root + 'models/veo-3.1-fast-generate-preview:predictLongRunning',
      {
        method: 'POST',
        body: JSON.stringify({
          instances: [
            {
              prompt,
              image: {
                bytesBase64Encoded: fs
                  .readFileSync(dir + '/Start_Frame.png')
                  .toString('base64'),
                mimeType: 'image/png',
              },
            },
          ],
          parameters,
        }),
      },
    );
    fs.writeFileSync(dir + '/Operation.json', JSON.stringify(j, null, 2));
    console.log('Submitted one eight-second generation.');
  } else {
    const op = JSON.parse(fs.readFileSync(dir + '/Operation.json', 'utf8'));
    const j = await request(root + op.name);
    fs.writeFileSync(dir + '/Status.json', JSON.stringify(j, null, 2));
    if (!j.done) {
      console.log('Generation still running.');
      process.exit(0);
    }
    if (j.error) {
      console.log(JSON.stringify(j.error).replaceAll(key, '[REDACTED]'));
      process.exit(1);
    }
    const vid = j.response?.generateVideoResponse?.generatedSamples?.[0]?.video;
    if (!vid?.uri) {
      console.log(
        'No video returned. Response fields:',
        Object.keys(j.response || {}),
      );
      console.log(JSON.stringify(j.response).replaceAll(key, '[REDACTED]'));
      process.exit(1);
    }
    const url = new URL(vid.uri);
    if (!url.hostname.endsWith('.googleapis.com'))
      throw new Error('Unexpected download host');
    const r = await fetch(url, {
      headers: { 'x-goog-api-key': key },
      signal: AbortSignal.timeout(60000),
    });
    if (!r.ok) throw new Error('Video download HTTP ' + r.status);
    fs.writeFileSync(
      dir + '/FCA_Veo_Loading_Raw.mp4',
      Buffer.from(await r.arrayBuffer()),
    );
    console.log('Saved FCA_Veo_Loading_Raw.mp4');
  }
} catch (e) {
  console.log(
    'Request failed:',
    String(e.message).replaceAll(key, '[REDACTED]'),
  );
  process.exitCode = 1;
}
