
import MacBookSales from './components/MacBookSales';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

export default function Home() {

  return (
    <>
      <main>
        <Header />
          <MacBookSales />
        <Footer />
      </main>
    </>
  );
}
