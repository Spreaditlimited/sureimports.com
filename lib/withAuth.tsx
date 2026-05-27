// lib/withAuth.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { ComponentType } from 'react';

export function withAuth<T extends object>(Component: ComponentType<T>) {
  return async function AuthenticatedComponent(props: T) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('token');

    if (!authToken) {
      redirect('/auth/login');
    }

    return <Component {...props} />;
  };
}
