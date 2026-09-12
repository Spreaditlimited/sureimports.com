import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
test('profile reads and writes authenticate before database access',()=>{
  for(const file of ['app/api/user/[pidUser]/route.ts','app/api/profile-update/route.ts','app/api/profile-update-check/route.ts','app/api/user/check-bank-details/route.ts','app/api/user/update-shipping-address/route.ts']){
    const source=read(file);
    assert.ok(source.indexOf('await currentUser()')<source.indexOf('prisma.users.'),file);
    assert.match(source,/pidUser !== session\.pidUser/,file);
    assert.match(source,/status: 401|denied\('Unauthorized', 401\)/,file);
  }
});
test('profile mutations check origin and credential material is not returned',()=>{
  for(const file of ['app/api/profile-update/route.ts','app/api/user/update-shipping-address/route.ts'])
    assert.match(read(file),/request\.headers\.get\('origin'\) !== new URL\(request\.url\)\.origin/);
  const profile=read('app/api/user/[pidUser]/route.ts');
  assert.match(profile,/userPassword, userSession, loginKey, loginStamp, \.\.\.profile/);
  assert.doesNotMatch(profile,/NextResponse\.json\(\{ \.\.\.user,/);
  assert.doesNotMatch(read('app/api/profile-update-check/route.ts'),/prisma\.users\.(update|create|delete)/);
});
test('account loaders do not execute schema migrations',()=>{
  for(const file of ['app/api/auth/me/route.ts','app/api/auth/session/route.ts','app/api/profile-update/route.ts','app/api/user/[pidUser]/route.ts'])
    assert.doesNotMatch(read(file),/ALTER TABLE|CREATE TABLE/,file);
});
test('server route handlers never import React client hooks',()=>{
  const files=readdirSync(new URL('../app/api/',import.meta.url),{recursive:true}).filter(f=>f.endsWith('/route.ts'));
  for(const file of files)assert.doesNotMatch(read('app/api/'+file),/import\s*\{[^}]*\b(?:useRouter|useState|useEffect|useSearchParams|usePathname)\b/,file);
});
