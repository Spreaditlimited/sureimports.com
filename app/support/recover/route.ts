import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { cookieName } from '@/lib/support/guest';
import { verifySupportRecoveryToken } from '@/lib/support/recovery';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const recovery = verifySupportRecoveryToken(token);
  if (!recovery) return new Response('This chat link has expired.', { status: 410 });
  const [conversation] = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT c.id FROM support_conversations c JOIN support_guests g ON g.id=c.customerId
    WHERE c.id=${recovery.conversationId} AND c.customerId=${recovery.guestId}
      AND c.ownerKind='GUEST' AND c.brand='SURE_IMPORTS'
      AND g.expiresAt>NOW(3) AND g.claimedBy IS NULL LIMIT 1`;
  if (!conversation) return new Response('This chat link is no longer available.', { status: 410 });
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 86400,
  });
  const response = Response.redirect(`https://www.sureimports.com/support?conversation=${conversation.id}`, 303);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
