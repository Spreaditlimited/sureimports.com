import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Redirect Helper',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginAliasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
