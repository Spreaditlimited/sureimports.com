import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InstallApp from '@/components/install/InstallApp';

export const metadata: Metadata = {
  title: 'Install Sure Imports',
  description: 'Add Sure Imports to your Home Screen for quick access to your dashboard, orders and support.',
  alternates: { canonical: 'https://www.sureimports.com/install' },
};

export default function InstallPage() {
  return <><Navbar forceLightNavbar /><InstallApp /><Footer /></>;
}
