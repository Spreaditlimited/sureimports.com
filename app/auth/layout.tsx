// import { useAuth } from "@/lib/AuthContext"
// import React from 'react';

// const AuthLayout = ({ children }: { children: React.ReactNode }) => {
//         return <div className="min-h-screen text-black dark:text-white-dark">{children}</div>;
// };

// export default AuthLayout;

import { AuthProvider } from '@/lib/AuthContext';
import type React from 'react'; // Import React

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
