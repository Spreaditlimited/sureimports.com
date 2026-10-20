import { sessionCookieLifetime } from '@/lib/auth/session-policy.mjs';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/loginRedirect';
import { socialCookiePolicy } from './policy.mjs';
import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import type { Accounts, Adapter, Account } from './types';
import { digest, token } from './policy.mjs';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '@/lib/jwt';
import { claimAffiliateAttribution } from '@/lib/affiliate/attribution';
import type { NextRequest } from 'next/server';
const map = (
  u: {
    pidUser: string;
    userEmail: string;
    userPassword: string | null;
    userCid: string | null;
    userStatus: string | null;
    loginStatus: string | null;
  } | null,
): Account | null =>
  u
    ? {
        id: u.pidUser,
        email: u.userEmail,
        password: u.userPassword,
        active:
          u.userCid === 'VERIFIED' &&
          (!u.userStatus || u.userStatus === 'AL1') &&
          !['TEMP_PASSWORD_UNUSED', 'TEMP_PASSWORD_USED'].includes(
            u.loginStatus || '',
          ),
      }
    : null;
function accounts(tx: Prisma.TransactionClient): Accounts {
  return {
    rows: <T>(sql: string, values: unknown[] = []) =>
      tx.$queryRawUnsafe<T[]>(sql, ...values),
    execute: (sql, values = []) => tx.$executeRawUnsafe(sql, ...values),
    find: async (email) =>
      map(await tx.users.findUnique({ where: { userEmail: email } })),
    get: async (id) =>
      map(await tx.users.findUnique({ where: { pidUser: id } })),
    verify: (u, password) =>
      u.password
        ? bcrypt.compare(password, u.password)
        : Promise.resolve(false),
    create: async (email, details) => {
      const u = await tx.users.create({
        data: {
          pidUser: 'CUS' + token().slice(0, 20),
          userEmail: email,
          userFirstname: details.firstName,
          userLastname: details.lastName,
          userPassword: await bcrypt.hash(token(), 12),
          userCid: 'VERIFIED',
          loginStatus: 'SOCIAL_AUTH',
          userStatus: 'AL1',
          userAffiliateCode: token().slice(0, 10),
        },
      });
      return map(u)!;
    },
  };
}
export const adapter: Adapter = {
  ...accounts(prisma),
  namespace: 'sure_customer',
  origin: 'https://www.sureimports.com',
  login: '/auth/login',
  home: DEFAULT_LOGIN_REDIRECT,
  brand: 'Sure Imports',
  terms: 'https://www.sureimports.com/terms-and-conditions',
  transaction: (fn) =>
    prisma.$transaction((tx) => fn(accounts(tx)), { timeout: 15000 }),
  current: async () => {
    const raw = (await cookies()).get('token')?.value;
    if (!raw) return null;
    const payload = verifyToken(raw) as {
      pidUser?: string;
      iat?: number;
    } | null;
    if (!payload?.pidUser || !payload.iat) return null;
    const account = await accounts(prisma).get(payload.pidUser);
    if (!account?.active) return null;
    return { account, sessionHash: digest(raw), createdAt: payload.iat * 1000 };
  },
  session: async (account, req, response, _next, rememberMe) => {
    const u = await prisma.users.findUnique({ where: { pidUser: account.id } });
    if (!u) throw Error('Unavailable');
    const claim = await claimAffiliateAttribution(
      req as NextRequest,
      u.pidUser,
      u.userEmail,
    );
    if (claim && u.userAffiliateRef !== claim.referralCode)
      await prisma.users.update({
        where: { pidUser: u.pidUser },
        data: { userAffiliateRef: claim.referralCode },
      });
    response.cookies.set(
      'token',
      generateToken({
        pidUser: u.pidUser,
        userEmail: u.userEmail,
        userFirstname: u.userFirstname,
        userImage: u.userImage,
      }),
      {
        httpOnly: true,
        secure: socialCookiePolicy(new URL(req.url).origin).secure,
        sameSite: 'lax',
        path: '/',
        ...sessionCookieLifetime(rememberMe),
      },
    );
  },
};
