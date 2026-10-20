import { currentUser } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';
import { normalizeAccountCountry } from '@/lib/features/country';
export async function PUT(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ message: 'Invalid origin.' }, { status: 403 });
  const user = await currentUser();
  if (!user) return Response.json({ message: 'Please sign in again.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const country = normalizeAccountCountry(body?.country);
  if (!country) return Response.json({ message: 'Select a valid country.' }, { status: 400 });
  await prisma.users.update({ where: { pidUser: user.pidUser }, data: { country, updatedAt: new Date() } });
  return Response.json({ country });
}
