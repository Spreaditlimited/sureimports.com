import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await checkAuth(); if (!auth) return new Response('Unauthorized', { status: 401 });
  const { id } = await params;
  const proof = await prisma.vehicle_payment_proofs.findFirst({ where: { id, order: { pidUser: auth.pidUser } } });
  if (!proof) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(proof.content), { headers: { 'Content-Type': proof.mime, 'Content-Disposition': `attachment; filename="${proof.filename}"`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}
