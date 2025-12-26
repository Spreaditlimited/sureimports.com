import * as React from 'react';
import ShippingPolicy from '../components/ShippingPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <ShippingPolicy />
    </main>
    <Footer />
  </>
);

export default Page;
