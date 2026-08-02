// import React from 'react';

// const AuthLayout = ({ children }: { children: React.ReactNode }) => {
//         return <div className="min-h-screen text-black dark:text-white-dark">{children}</div>;
// };

// export default AuthLayout;

import { Suspense, type ReactNode } from 'react';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
