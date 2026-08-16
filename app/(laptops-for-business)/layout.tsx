import type { ReactNode } from 'react';

export default function LaptopsForBusinessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="public-site-theme contents">{children}</div>;
}
