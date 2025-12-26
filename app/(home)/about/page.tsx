import * as React from 'react';
import AboutUs from '../components/AboutUs';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const About: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <AboutUs />
    </main>
    <Footer />
  </>
);

export default About;
