import { prisma } from '@/lib/prisma';
import { cleanupAttachments } from '@/lib/support/attachment-http';
export const maxDuration=120;
export async function GET(request:Request) {
 if(!process.env.CRON_SECRET || request.headers.get('authorization')!==`Bearer ${process.env.CRON_SECRET}`) return Response.json({error:'Unauthorized'},{status:401});
 // Retention must continue even if the public chat gate is disabled.
 return Response.json(await cleanupAttachments(prisma));
}
