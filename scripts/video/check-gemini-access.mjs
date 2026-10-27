const key = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '')
  .trim()
  .replace(/^["']|["']$/g, '');
if (!key) {
  console.log('Gemini key: missing or empty');
  process.exit(1);
}
console.log('Gemini key: configured (value hidden)');
try {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',
    { headers: { 'x-goog-api-key': key }, signal: AbortSignal.timeout(30000) },
  );
  const data = await res.json();
  console.log('Google model-list HTTP status:', res.status);
  if (!res.ok) {
    console.log('Google error status:', data.error?.status || 'unknown');
    process.exitCode = 1;
  } else {
    console.log('Key validation: successful');
    for (const m of data.models || [])
      if (m.name.includes('veo'))
        console.log(
          JSON.stringify({
            model: m.name,
            methods: m.supportedGenerationMethods,
          }),
        );
    console.log(
      'No generation requested. Billing and generation quota are not confirmed by model listing.',
    );
  }
} catch (e) {
  console.log('Connection check failed:', e.cause?.code || e.name);
  process.exitCode = 1;
}
