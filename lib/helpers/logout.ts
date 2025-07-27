'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function logout() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
  return response;
  // console.log('Logging out...');
  // (await cookies()).delete('Authorization');
  // (await cookies()).delete('UserData');
}

// import { NextResponse } from "next/server"

// export async function POST() {
//   const response = NextResponse.json({ message: "Logged out successfully" })
//   response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) })
//   return response
// }
