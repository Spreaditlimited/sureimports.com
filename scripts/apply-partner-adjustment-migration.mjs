import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { createHash,randomUUID } from 'node:crypto';
const db=new PrismaClient();
const name='20260914150000_partner_order_adjustments';
const sql=readFileSync(new URL('../prisma/migrations/'+name+'/migration.sql',import.meta.url),'utf8');
const checksum=createHash('sha256').update(sql).digest('hex');
try{
 const rows=await db.$queryRaw`SELECT checksum,finished_at,rolled_back_at FROM _prisma_migrations WHERE migration_name=${name}`;
 if(rows.some(r=>r.finished_at&&!r.rolled_back_at)){
  if(!rows.some(r=>r.finished_at&&!r.rolled_back_at&&r.checksum===checksum))throw Error('CHECKSUM_MISMATCH');
  console.log('Partner adjustment migration already applied.');
 }else{
  if(rows.some(r=>!r.finished_at&&!r.rolled_back_at))throw Error('UNFINISHED_MIGRATION');
  const statements=sql.split(';').map(s=>s.trim()).filter(Boolean);
  if(statements.length!==4||statements.some(s=>!/^CREATE TABLE partner_(order_adjustments|adjustment_payments|order_payment_fees|adjustment_refunds)\s*\(/.test(s)))throw Error('UNEXPECTED_SQL');
  const parent=await db.$queryRaw`SELECT COLLATION_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='procurement_partner_customer_orders' AND COLUMN_NAME='id'`;
  const defaults=await db.$queryRaw`SELECT DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=DATABASE()`;
  if(!parent.length||parent[0].COLLATION_NAME!==defaults[0].DEFAULT_COLLATION_NAME)throw Error('COLLATION_REVIEW_REQUIRED');
  if(!process.argv.includes('--apply')){console.log('Ready: four additive tables; no existing payment, order or wallet rows will be changed.');}
  else{
   const id=randomUUID();await db.$executeRaw`INSERT INTO _prisma_migrations (id,checksum,migration_name,started_at,applied_steps_count) VALUES (${id},${checksum},${name},NOW(3),0)`;
   for(const statement of statements)await db.$executeRawUnsafe(statement);
   await db.$executeRaw`UPDATE _prisma_migrations SET finished_at=NOW(3),applied_steps_count=4 WHERE id=${id}`;
   console.log('Applied four partner adjustment tables. No existing financial records changed.');
  }
 }
}catch(e){console.error('Migration did not complete:',/^[A-Z_]+$/.test(e.message)?e.message:e.code||'DATABASE_ERROR');process.exitCode=1;}finally{await db.$disconnect();}
