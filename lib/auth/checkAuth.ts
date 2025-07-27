// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { any } from 'zod';

interface UserPayload {
  pidUser: string;
  userEmail: string;
  userFirstname?: string;
  userImage?: string;
}

export async function checkAuth(): Promise<UserPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'], // Specify allowed algorithms
      ignoreExpiration: false, // Don't accept expired tokens
      clockTolerance: 15, // 15 seconds tolerance for clock skew
    }) as UserPayload;

    // Validate required claims
    if (!decoded.pidUser || !decoded.userEmail) {
      console.warn('JWT missing required claims');
      return null;
    }

    console.log('JWT verified successfully:', decoded);

    return { ...decoded };
  } catch (error: any) {
    // Handle specific error types
    if (error.name === 'TokenExpiredError') {
      console.warn('JWT expired at', error.expiredAt);
    } else if (error.name === 'JsonWebTokenError') {
      console.warn('JWT error:', error.message);
    } else {
      console.error('JWT verification failed:', error);
    }
    return null;
  }
}
