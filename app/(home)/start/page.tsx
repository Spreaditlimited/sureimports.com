import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StartGuide from './StartGuide';

const title = 'Find your way to buy from China';
const description = 'New to importing or ready to build your brand? Find the right Sure Imports service: buy from Chinese websites and pay in naira, or source with LineScout.';
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: 'https://www.sureimports.com/start' },
  openGraph: { title, description, url: 'https://www.sureimports.com/start' },
  twitter: { title, description },
};
export default function StartPage() {
  return <><Navbar forceLightNavbar /><StartGuide /><Footer /></>;
}
