import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

// Resolve ownership from a verified session, never a submitted user ID/email.
export async function currentUser() {
  if (!process.env.JWT_SECRET) return null;
  const token = (await cookies()).get('token')?.value;
  const payload = token ? verifyToken(token) : null;
  if (
    !payload ||
    !('pidUser' in payload) ||
    typeof payload.pidUser !== 'string'
  )
    return null;
  return prisma.users.findUnique({
    where: { pidUser: payload.pidUser },
    select: { pidUser: true, userEmail: true },
  });
}
