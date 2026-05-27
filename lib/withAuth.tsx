// lib/withAuth.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function withAuth(Component: React.ComponentType) {
  return async function AuthenticatedComponent(props: any) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token');

    if (!authToken) {
      redirect('/login');
    }

    return <Component {...props} />;
  };
}
