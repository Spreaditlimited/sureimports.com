import * as React from 'react';
import WarrantyPolicy from '../components/WarrantyPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const Page: React.FC = () => (
  <>
    <Header />
      <main className="min-h-screen">
        <WarrantyPolicy />
      </main>
    <Footer />
  </>
);

export default Page;