import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const admin = path.resolve(root, '../admin.sureimports.com');
const files = ['lib/support/policy.ts', 'lib/support/management.ts', 'components/support/SupportReports.tsx', 'lib/support/http.ts', 'lib/support/store.ts', 'lib/support/attachment-policy.ts', 'lib/support/attachment-storage.ts', 'lib/support/attachment-http.ts', 'lib/support/push-policy.ts', 'lib/support/push-store.ts', 'components/support/SupportWorkspace.tsx', 'components/support/support.module.css'];
for (const file of files) {
  const [customer, agent] = await Promise.all([readFile(path.join(root, file)), readFile(path.join(admin, file))]);
  if (!customer.equals(agent)) throw new Error(`Support source drift: ${file}`);
}
console.log('Shared support policy, storage, API handling and interface match across both apps.');
