import * as React from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <PrivacyPolicy />
    </main>
    <Footer />
  </>
);

export default Page;
