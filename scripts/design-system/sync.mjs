// Run from the canonical Sure Imports repository. No cross-repo imports at runtime.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repos = ['admin.sureimports.com', 'affiliate.sureimports.com', 'partner.sureimports.com', 'linescout'];
const sourceFiles = ['design-system/tokens.css', 'design-system/components.css'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'design-system/manifest.json'), 'utf8'));
const write = process.argv.includes('--write');
const nextManifest = { ...manifest, files: Object.fromEntries(sourceFiles.map(f => [f, hash(fs.readFileSync(path.join(root, f)))])) };
const files = [...sourceFiles, 'scripts/design-system/check.mjs'];
const targets = repos.map(repo => path.resolve(root, '..', repo));
// Preflight all consumers before writing anything. Refuse to overwrite local foundation edits.
for (const target of targets) {
  const previous = JSON.parse(fs.readFileSync(path.join(target, 'design-system/manifest.json'), 'utf8'));
  for (const [file, expected] of Object.entries(previous.files)) {
    if (hash(fs.readFileSync(path.join(target, file))) !== expected) throw new Error(`Concurrent foundation edit: ${target}/${file}`);
  }
}
if (write) {
  fs.writeFileSync(path.join(root, 'design-system/manifest.json'), JSON.stringify(nextManifest, null, 2) + '\n');
  for (const target of targets) {
    for (const file of files) fs.copyFileSync(path.join(root, file), path.join(target, file));
    fs.copyFileSync(path.join(root, 'design-system/manifest.json'), path.join(target, 'design-system/manifest.json'));
  }
} else {
  for (const target of targets) {
    for (const file of files) {
      if (!fs.readFileSync(path.join(root, file)).equals(fs.readFileSync(path.join(target, file)))) throw new Error(`Foundation drift: ${target}/${file}`);
    }
  }
}
console.log(`${write ? 'Synced' : 'Verified'} foundation across Sure Imports, admin, affiliate, partner and LineScout.`);
