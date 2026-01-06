'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navigation
        onNavigateHome={() => (window.location.href = '/')}
        onNavigateSignIn={() =>
          (window.location.href = 'https://www.sureimports.com/auth/login')
        }
        onNavigateBlog={() => (window.location.href = '/blog')}
      />
      <main className="flex-grow">{children}</main>
      <Footer
        onNavigateToShippingPolicy={() =>
          (window.location.href = '/shipping-policy')
        }
        onNavigateToWarrantyPolicy={() =>
          (window.location.href = '/warranty-policy')
        }
        onNavigateToTermsConditions={() =>
          (window.location.href = '/terms-and-conditions')
        }
        onNavigateToPrivacyPolicy={() =>
          (window.location.href = '/privacy-policy')
        }
        onNavigateToAbout={() => (window.location.href = '/about')}
      />
    </div>
  );
}
