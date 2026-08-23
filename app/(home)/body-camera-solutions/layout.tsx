import type { ReactNode } from 'react';
import Footer from '@/app/(home)/components/Footer';
import SolutionHeader from './_components/SolutionHeader';

export default function BodyCameraSolutionsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <SolutionHeader />
      {children}
      <Footer />
    </div>
  );
}
