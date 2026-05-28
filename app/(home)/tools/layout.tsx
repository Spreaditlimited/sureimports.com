import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Import Tools',
    template: '%s | Import Tools | Sure Imports',
  },
  description:
    'Free import tools for landed cost estimation, CBM calculation, shipping comparison, and pricing decisions.',
  alternates: {
    canonical: 'https://www.sureimports.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900">
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
