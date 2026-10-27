import fs from 'node:fs';
const root = 'deliverables/china-import-stories/FCA-veo-production-v1';
const scenes = JSON.parse(fs.readFileSync(root + '/Scene_Manifest.json'));
const key = (process.env.GEMINI_API_KEY || '')
  .trim()
  .replace(/^["']|["']$/g, '');
const api = 'https://generativelanguage.googleapis.com/v1beta/';
const mode = process.argv[2];
const chosen = process.argv.slice(3);
async function req(url, body) {
  const r = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(90000),
  });
  const j = await r.json();
  if (!r.ok)
    throw new Error(
      JSON.stringify({
        http: r.status,
        status: j.error?.status,
        message: j.error?.message,
      }),
    );
  return j;
}
for (const s of scenes) {
  if (chosen.length && !chosen.includes(s.id)) continue;
  const dir = root + '/Scene_Library/' + s.id;
  if (fs.existsSync(dir + '/Clean.mp4')) {
    console.log(s.id + ': saved');
    continue;
  }
  try {
    if (mode === 'start') {
      if (fs.existsSync(dir + '/Operation.json')) {
        console.log(s.id + ': already submitted');
        continue;
      }
      const parameters = {
        aspectRatio: '9:16',
        resolution: '720p',
        durationSeconds: 8,
        sampleCount: 1,
        personGeneration: 'allow_adult',
      };
      fs.writeFileSync(
        dir + '/Settings.json',
        JSON.stringify({ model: s.model, parameters }, null, 2),
      );
      const j = await req(api + 'models/' + s.model + ':predictLongRunning', {
        instances: [
          {
            prompt: fs.readFileSync(dir + '/Prompt.txt', 'utf8'),
            image: {
              bytesBase64Encoded: fs
                .readFileSync(dir + '/Start_Frame.png')
                .toString('base64'),
              mimeType: 'image/png',
            },
          },
        ],
        parameters,
      });
      fs.writeFileSync(dir + '/Operation.json', JSON.stringify(j, null, 2));
      console.log(s.id + ': submitted');
    } else {
      if (!fs.existsSync(dir + '/Operation.json')) continue;
      const op = JSON.parse(fs.readFileSync(dir + '/Operation.json'));
      const j = await req(api + op.name);
      fs.writeFileSync(dir + '/Status.json', JSON.stringify(j, null, 2));
      if (!j.done) {
        console.log(s.id + ': running');
        continue;
      }
      const result = j.response?.generateVideoResponse;
      const video = result?.generatedSamples?.[0]?.video;
      if (!video?.uri) {
        console.log(s.id + ': ' + JSON.stringify(j.error || result));
        continue;
      }
      const url = new URL(video.uri);
      if (!url.hostname.endsWith('.googleapis.com'))
        throw new Error('Unexpected host');
      const res = await fetch(url, {
        headers: { 'x-goog-api-key': key },
        signal: AbortSignal.timeout(90000),
      });
      if (!res.ok) throw new Error('Download ' + res.status);
      fs.writeFileSync(
        dir + '/Clean.mp4',
        Buffer.from(await res.arrayBuffer()),
      );
      console.log(s.id + ': downloaded');
    }
  } catch (e) {
    console.log(s.id + ': ' + String(e.message).replaceAll(key, '[REDACTED]'));
    if (mode === 'start') break;
  }
}
