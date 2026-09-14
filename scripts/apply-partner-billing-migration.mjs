import {PrismaClient} from '@prisma/client';
import {readFileSync} from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
const db=new PrismaClient();const name='20260914160000_partner_international_billing';
const sql=readFileSync(new URL('../prisma/migrations/'+name+'/migration.sql',import.meta.url),'utf8');const checksum=createHash('sha256').update(sql).digest('hex');
try{
 const rows=await db.$queryRaw`SELECT checksum,finished_at,rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
 if(rows.some(r=>r.finished_at&&!r.rolled_back_at)){if(!rows.some(r=>r.finished_at&&!r.rolled_back_at&&r.checksum===checksum))throw Error('CHECKSUM_MISMATCH');console.log('International billing migration already applied.');}
 else{
  if(rows.some(r=>!r.finished_at&&!r.rolled_back_at))throw Error('UNFINISHED_MIGRATION');
  const statements=sql.split(';').map(s=>s.trim()).filter(Boolean);
  if(statements.length!==3||statements.some(s=>!/^CREATE TABLE partner_platform_(accounts|agreements|charges)\s*\(/.test(s)))throw Error('UNEXPECTED_SQL');
  if(!process.argv.includes('--apply'))console.log('Ready: three new billing tables. No existing orders, balances, subscriptions or country prices will be changed.');
  else{const id=randomUUID();await db.$executeRaw`INSERT INTO _prisma_migrations(id,checksum,migration_name,started_at,applied_steps_count) VALUES(${id},${checksum},${name},NOW(3),0)`;for(const statement of statements)await db.$executeRawUnsafe(statement);await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=3 WHERE id=${id}`;console.log('Applied three international platform billing tables. Existing financial records unchanged.');}
 }
}catch(e){console.error('Billing migration:',/^[A-Z_]+$/.test(e.message)?e.message:e.code||'DATABASE_ERROR');process.exitCode=1;}finally{await db.$disconnect();}
