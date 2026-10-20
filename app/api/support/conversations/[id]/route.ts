import { customerSupport } from '@/lib/support/server';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  return customerSupport.history(request, (await context.params).id);
}
export async function POST(request: Request, context: Context) {
  return customerSupport.send(request, (await context.params).id);
}
