import { ReactNode } from 'react';
import { Suspense } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { TrackingPixels } from './components/TrackingPixels';
import { AffiliateTracker } from './components/AffiliateTracker';
import { BackToTopButton } from './components/BackToTopButton';

type HomeLayoutProps = {
  children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <>
      <Suspense fallback={null}>
        <TrackingPixels />
      </Suspense>
      <AffiliateTracker />
      {children}
      <WhatsAppButton
        waID="CUR7YKW3K3RBA1"
        message="Hello! I'd like to ask about your services."
        position="bottom-left"
      />
      <BackToTopButton />
    </>
  );
};

export default HomeLayout;
