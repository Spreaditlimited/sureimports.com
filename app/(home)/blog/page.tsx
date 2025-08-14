import BlogList from "../components/BlogList";
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';

const Page: React.FC = () => (
  <>
    <Header />
      <main className="min-h-screen">
        <BlogList />
      </main>
    <Footer />
  </>
);

export default Page;




