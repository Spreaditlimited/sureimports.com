const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function route(env, fetch) {
  const mod = { exports: {} };
  const code = ts.transpileModule(
    fs.readFileSync('app/api/google-reviews/route.ts', 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText;
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    process: { env }, fetch, AbortSignal, console: { error() {} },
  })(() => ({ NextResponse: { json: (body, init) => Response.json(body, init) } }), mod, mod.exports);
  return mod.exports.GET;
}
const request = (headers) => new Request('https://sureimports.com/api/google-reviews', { headers });

test('missing credentials and cross-site requests never call Google', async () => {
  let calls = 0;
  const get = route({}, async () => { calls++; });
  assert.equal((await get(request())).status, 503);
  assert.equal((await get(request({ 'sec-fetch-site': 'cross-site' }))).status, 403);
  assert.equal(calls, 0);
});

test('returns attributed original reviews with no caching or credentials in public data', async () => {
  const get = route({ SURE_IMPORTS_GOOGLE_MAPS_API: 'test-private-key' }, async (url, options) => {
    assert.match(url, /ChIJiZvgRGGPOxARlHVuAEV0jqw/);
    assert.ok(!url.includes('test-private-key'));
    assert.equal(options.headers['X-Goog-Api-Key'], 'test-private-key');
    assert.equal(options.cache, 'no-store');
    return Response.json({
      displayName: { text: 'Sure Importers Limited' }, rating: 4.8, userRatingCount: 94,
      reviews: Array.from({ length: 6 }, (_, i) => ({
        name: `review-${i}`, rating: 5, originalText: { text: 'Original review' },
        text: { text: 'Translation' }, authorAttribution: {
          displayName: 'Reviewer', uri: 'https://google.com/maps/contrib/1', photoUri: 'https://example.com/avatar',
        }, googleMapsUri: 'https://google.com/maps/reviews/1',
      })),
    });
  });
  const response = await get(request());
  assert.match(response.headers.get('cache-control'), /no-store/);
  const data = await response.json();
  assert.equal(data.reviews.length, 5);
  assert.equal(data.reviews[0].text, 'Original review');
  assert.equal(data.reviews[0].authorUrl, 'https://google.com/maps/contrib/1');
  assert.equal(data.reviews[0].url, 'https://google.com/maps/reviews/1');
  assert.equal(data.rating, 4.8);
  assert.ok(!JSON.stringify(data).includes('test-private-key'));
});

test('upstream errors and network failures return a safe unavailable response', async () => {
  for (const fetch of [async () => new Response('private upstream detail', { status: 403 }), async () => { throw Error('secret'); }]) {
    const response = await route({ GOOGLE_PLACES_API_KEY: 'key' }, fetch)(request());
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { unavailable: true });
  }
});
