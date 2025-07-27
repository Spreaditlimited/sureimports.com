// lib/auth.ts alternative version
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getUser(): Promise<string | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded as any;
    // Assuming the decoded token contains user information
    // decoded: {
    //     pidUser: user.pidUser,
    //     userEmail: user.userEmail,
    //     userFirstname: user.userFirstname,
    //     userImage: user.userImage,
    //   },
  } catch (error) {
    console.error('Failed to verify JWT:', error);
    return null;
  }
}
