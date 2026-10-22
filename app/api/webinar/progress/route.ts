import { currentUser } from '@/lib/auth/current-user';
import { prisma } from '@/lib/prisma';
import { rememberWebinar, watchedFromRequest } from '@/lib/webinar/server';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return new Response(null, { status: 403 });
  if (!watchedFromRequest(request)) return new Response(null, { status: 204 });
  const identity = await currentUser();
  if (!identity) return new Response(null, { status: 204 });
  const user = await prisma.users.findUnique({
    where: { pidUser: identity.pidUser },
  });
  if (user?.userCid === 'VERIFIED') await rememberWebinar(user.userEmail, true);
  return new Response(null, { status: 204 });
}
