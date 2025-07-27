// lib/auth.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkAuth() {
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth_token');

  if (!authToken) {
    redirect('/login');
  }

  return authToken.value;
}
