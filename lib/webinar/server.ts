import { after } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WEBINAR_COOKIE, WEBINAR_VIDEO_ID } from './content';
export function watchedFromRequest(request: Request) {
  return (
    request.headers
      .get('cookie')
      ?.split(';')
      .some((c) => c.trim() === `${WEBINAR_COOKIE}=${WEBINAR_VIDEO_ID}`) ||
    false
  );
}
export async function rememberWebinar(
  email: string,
  watched: boolean,
  pidUser?: string,
) {
  await prisma.$executeRaw`INSERT INTO webinar_welcomes (email, watched, pidUser, accountCreatedAt)
    VALUES (${email.trim().toLowerCase()}, ${watched ? 1 : 0}, ${pidUser || null}, ${pidUser ? new Date() : null})
    ON DUPLICATE KEY UPDATE watched = GREATEST(watched, VALUES(watched)),
    pidUser = COALESCE(pidUser, VALUES(pidUser)), accountCreatedAt = COALESCE(accountCreatedAt, VALUES(accountCreatedAt))`;
}
export function queueAccountWelcome(
  request: Request | undefined,
  email: string,
  pidUser: string,
) {
  const watched = request ? watchedFromRequest(request) : false;
  after(async () => {
    try {
      await rememberWebinar(email, watched, pidUser);
    } catch (error) {
      console.error('Unable to queue account onboarding', error);
    }
  });
}
