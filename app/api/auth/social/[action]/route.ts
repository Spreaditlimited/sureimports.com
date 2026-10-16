import { configuration, status, start, googleCallback, complete } from '@/lib/apple/engine';
export const runtime='nodejs';
export const dynamic='force-dynamic';
type Context={params:Promise<{action:string}>};
export async function GET(req:Request,ctx:Context){const {action}=await ctx.params;if(action==='config')return configuration(req);if(action==='status')return status();return Response.json({message:'Not found'},{status:404});}
export async function POST(req:Request,ctx:Context){const {action}=await ctx.params;if(action==='start')return start(req);if(action==='google')return googleCallback(req);if(action==='complete')return complete(req);return Response.json({message:'Not found'},{status:404});}
