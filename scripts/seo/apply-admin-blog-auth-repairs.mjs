import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const patch = path.resolve(
  'deliverables/adsense-seo-repairs-2026-10-27/admin-auth-patch',
);
const admin = '/Users/tochukwunkwocha/projects/admin.sureimports.com';
const release = '/private/tmp/sureimports-admin-repair-release';
const manifest = JSON.parse(fs.readFileSync(`${patch}/manifest.json`, 'utf8'));
const hash = (file) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const item of manifest) {
  if (
    hash(path.join(admin, item.path)) !== item.beforeSha256 ||
    hash(path.join(patch, item.path)) !== item.afterSha256
  )
    throw Error(`Concurrent change: ${item.path}`);
}
for (const item of manifest) {
  fs.copyFileSync(path.join(patch, item.path), path.join(admin, item.path));
  fs.copyFileSync(path.join(patch, item.path), path.join(release, item.path));
}
fs.writeFileSync(
  `${patch}/applied.json`,
  JSON.stringify({ at: new Date(), files: manifest }, null, 2),
  { flag: 'wx' },
);
console.log('Applied four reviewed blog permission checks.');
