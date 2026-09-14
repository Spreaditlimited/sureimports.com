import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
const adminMode = process.argv.includes('--admin');
const config = parseEnv(readFileSync(adminMode ? '/Users/tochukwunkwocha/projects/admin.sureimports.com/.env.local' : '.env.local', 'utf8'));
const developmentFile = adminMode ? '/Users/tochukwunkwocha/projects/admin.sureimports.com/.env.development.local' : '.env.development.local';
if (existsSync(developmentFile)) Object.assign(config, parseEnv(readFileSync(developmentFile, 'utf8')));
const db = new PrismaClient({ datasources: { db: { url: config.DATABASE_URL } } });
const session = adminMode ? 'refunds-admin' : 'refunds-main';
const origin = adminMode ? 'http://localhost:3000' : 'http://localhost:3001';
function browser(args) {
  const run=spawnSync('agent-browser',['--session',session,...args],{encoding:'utf8',timeout:60000});
  if(run.status)throw Error('Browser command failed: '+args[0]);
  // Never print command arguments or cookies.
}
try {
  const sample = !adminMode && process.argv.includes('--with-refunds') ? await db.refund_records.findFirst({ where: { currency: 'USD', pidUser: { not: null } }, select: { pidUser: true } }) : null;
  const user = adminMode
    ? await db.admin.findFirst({ where: { userStatus: { in: ['superadmin','L1'] } }, select: { pidUser: true } })
    : await db.users.findUnique({ where: sample?.pidUser ? { pidUser: sample.pidUser } : { userEmail: process.env.REFUND_TEST_EMAIL || 'nkwochatochukwu@gmail.com' }, select: { pidUser: true, userEmail: true, userFirstname: true } });
  if (!user || !config.JWT_SECRET) throw Error('Test identity or signing configuration unavailable');
  const token=jwt.sign(user,config.JWT_SECRET,{algorithm:'HS256',expiresIn:'10m'});
  // The login page calls /api/auth/me and clears an absent cookie. Navigate away
  // first so that a late anonymous response cannot erase this test session.
  browser(['open','about:blank']);
  browser(['cookies','set','token',token,'--url',origin,'--path','/','--httpOnly']);
  browser(['open',origin+'/dashboard/refunds']);
  console.log('Opened short-lived local '+(adminMode?'admin':'customer')+' refund session. No mutations submitted.');
} catch(error) { console.error(error.message);process.exitCode=1; }
finally { await db.$disconnect(); }
