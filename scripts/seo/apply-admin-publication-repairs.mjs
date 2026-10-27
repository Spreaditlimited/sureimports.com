import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(
  'deliverables/adsense-seo-repairs-2026-10-27/admin-patch',
);
const admin = '/Users/tochukwunkwocha/projects/admin.sureimports.com';
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'),
);
const hash = (file) =>
  fs.existsSync(file)
    ? crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    : null;
for (const item of manifest) {
  const target = path.resolve(admin, item.path);
  if (!target.startsWith(`${admin}/`) || hash(target) !== item.beforeSha256)
    throw new Error(`Concurrent change detected: ${item.path}`);
  if (hash(path.join(root, item.path)) !== item.afterSha256)
    throw new Error(`Patch changed after preparation: ${item.path}`);
}
for (const item of manifest)
  fs.copyFileSync(path.join(root, item.path), path.join(admin, item.path));
fs.writeFileSync(
  path.join(root, 'applied.json'),
  JSON.stringify({ appliedAt: new Date(), files: manifest }, null, 2),
);
console.log(
  `Applied ${manifest.length} reviewed admin files; unrelated changes preserved.`,
);
