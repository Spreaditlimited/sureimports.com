import * as React from 'react';
import TermsAndConditions from '../components/TermsAndConditions';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const Page: React.FC = () => (
  <>
    <Header />
      <main className="min-h-screen">
        <TermsAndConditions />
      </main>
    <Footer />
  </>
);

export default Page;