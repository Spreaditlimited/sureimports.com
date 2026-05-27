'use client';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CustomerReviews from '../components/CustomerReviews';
import Footer from '../components/Footer';
import ShippingPolicy from '../components/ShippingPolicy';
import WarrantyPolicy from '../components/WarrantyPolicy';
import TermsAndConditions from '../components/TermsAndConditions';
import PrivacyPolicy from '../components/PrivacyPolicy';
import AboutUs from '../components/AboutUs';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';
import SignUpSuccess from '../components/SignUpSuccess';
import EmailVerificationSuccess from '../components/EmailVerificationSuccess';
import UnverifiedAccount from '../components/UnverifiedAccount';
import CookieConsent from '../components/CookieConsent';
import BlogList from '../components/BlogList';
import BlogDetail from '../components/BlogDetail';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '../actions/blogActions';

type Page =
  | 'home'
  | 'shipping-policy'
  | 'warranty-policy'
  | 'terms-conditions'
  | 'privacy-policy'
  | 'about'
  | 'sign-in'
  | 'sign-up'
  | 'forgot-password'
  | 'sign-up-success'
  | 'email-verification-success'
  | 'unverified-account'
  | 'blog'
  | 'blog-detail';

export default function Home() {
  const emptyPost: BlogPost = {
    id: '',
    title: '',
    excerpt: '',
    content: '',
    author: { name: '', avatar: '', role: '' },
    category: 'Import Guide',
    tags: [],
    publishDate: new Date().toISOString().split('T')[0],
    readTime: 0,
    featured: false,
    image: '',
    slug: '',
  };
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string>('');
  const router = useRouter();
  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleExternalAuth = () => {
    window.location.href = 'https://www.sureimports.com/auth/login';
  };

  const handleSignIn = () => {
    navigateToPage('sign-in');
  };

  const handleSignUp = () => {
    navigateToPage('sign-up');
  };

  const handleNavigateToBlog = () => {
    navigateToPage('blog');
  };

  const handleSelectBlogPost = (slug: string) => {
    setSelectedBlogSlug(slug);
    navigateToPage('blog-detail');
  };

  const handleBackToBlog = () => {
    navigateToPage('blog');
  };

  // Authentication Pages
  if (currentPage === 'sign-in') {
    return (
      <div>
        <SignIn
          onNavigateToSignUp={() => navigateToPage('sign-up')}
          onNavigateToForgotPassword={() => navigateToPage('forgot-password')}
          onNavigateToUnverifiedAccount={() =>
            navigateToPage('unverified-account')
          }
          onNavigateHome={() => navigateToPage('home')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'sign-up') {
    return (
      <div>
        <SignUp
          onNavigateToSignIn={() => navigateToPage('sign-in')}
          onNavigateToSignUpSuccess={() => navigateToPage('sign-up-success')}
          onNavigateToTerms={() => navigateToPage('terms-conditions')}
          onNavigateToPrivacy={() => navigateToPage('privacy-policy')}
          onNavigateHome={() => navigateToPage('home')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'forgot-password') {
    return (
      <div>
        <ForgotPassword
          onNavigateToSignIn={() => navigateToPage('sign-in')}
          onNavigateHome={() => navigateToPage('home')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'sign-up-success') {
    return (
      <div>
        <SignUpSuccess
          onNavigateToSignIn={() => navigateToPage('sign-in')}
          onNavigateHome={() => navigateToPage('home')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'email-verification-success') {
    return (
      <div>
        <EmailVerificationSuccess
          onNavigateToSignIn={() => navigateToPage('sign-in')}
          onNavigateHome={() => navigateToPage('home')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'unverified-account') {
    return (
      <div>
        <UnverifiedAccount
          onNavigateToSignIn={() => navigateToPage('sign-in')}
          onNavigateHome={() => navigateToPage('home')}
          userEmail="user@unverified.com"
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  // Policy and Info Pages
  if (currentPage === 'shipping-policy') {
    return (
      <div>
        <div className="min-h-screen bg-slate-900">
          <Navigation
            onNavigateHome={() => navigateToPage('home')}
            onNavigateSignIn={handleExternalAuth}
            onNavigateBlog={handleNavigateToBlog}
          />
          <ShippingPolicy />
          <Footer
            onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
            onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
            onNavigateToTermsConditions={() =>
              navigateToPage('terms-conditions')
            }
            onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
            onNavigateToAbout={() => navigateToPage('about')}
          />
        </div>
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'warranty-policy') {
    return (
      <div>
        <div className="min-h-screen bg-slate-900">
          <Navigation
            onNavigateHome={() => navigateToPage('home')}
            onNavigateSignIn={handleExternalAuth}
            onNavigateBlog={handleNavigateToBlog}
          />
          <WarrantyPolicy />
          <Footer
            onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
            onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
            onNavigateToTermsConditions={() =>
              navigateToPage('terms-conditions')
            }
            onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
            onNavigateToAbout={() => navigateToPage('about')}
          />
        </div>
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'terms-conditions') {
    return (
      <div>
        <div className="min-h-screen bg-slate-900">
          <Navigation
            onNavigateHome={() => navigateToPage('home')}
            onNavigateSignIn={handleExternalAuth}
            onNavigateBlog={handleNavigateToBlog}
          />
          <TermsAndConditions />
          <Footer
            onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
            onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
            onNavigateToTermsConditions={() =>
              navigateToPage('terms-conditions')
            }
            onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
            onNavigateToAbout={() => navigateToPage('about')}
          />
        </div>
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'privacy-policy') {
    return (
      <div>
        <div className="min-h-screen bg-slate-900">
          <Navigation
            onNavigateHome={() => navigateToPage('home')}
            onNavigateSignIn={handleExternalAuth}
            onNavigateBlog={handleNavigateToBlog}
          />
          <PrivacyPolicy />
          <Footer
            onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
            onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
            onNavigateToTermsConditions={() =>
              navigateToPage('terms-conditions')
            }
            onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
            onNavigateToAbout={() => navigateToPage('about')}
          />
        </div>
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'about') {
    return (
      <div>
        <div className="min-h-screen bg-slate-900">
          <Navigation
            onNavigateHome={() => navigateToPage('home')}
            onNavigateSignIn={handleExternalAuth}
            onNavigateBlog={handleNavigateToBlog}
          />
          <AboutUs />
          <Footer
            onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
            onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
            onNavigateToTermsConditions={() =>
              navigateToPage('terms-conditions')
            }
            onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
            onNavigateToAbout={() => navigateToPage('about')}
          />
        </div>
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  // Blog Pages
  if (currentPage === 'blog') {
    return (
      <div>
        <Navigation
          onNavigateHome={() => navigateToPage('home')}
          onNavigateSignIn={handleExternalAuth}
          onNavigateBlog={handleNavigateToBlog}
        />
        <BlogList
          blogPosts={[]}
        />
        <Footer
          onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
          onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
          onNavigateToTermsConditions={() => navigateToPage('terms-conditions')}
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
          onNavigateToAbout={() => navigateToPage('about')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  if (currentPage === 'blog-detail') {
    return (
      <div>
        <Navigation
          onNavigateHome={() => navigateToPage('home')}
          onNavigateSignIn={handleExternalAuth}
          onNavigateBlog={handleNavigateToBlog}
        />
        <BlogDetail
          post={emptyPost}
          onBack={handleBackToBlog}
          onSelectPost={handleSelectBlogPost}
        />
        <Footer
          onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
          onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
          onNavigateToTermsConditions={() => navigateToPage('terms-conditions')}
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
          onNavigateToAbout={() => navigateToPage('about')}
        />
        <CookieConsent
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
        />
      </div>
    );
  }

  // Home Page
  return (
    <div>
      <div className="min-h-screen bg-slate-900">
        <Navigation
          onNavigateHome={() => navigateToPage('home')}
          onNavigateSignIn={handleExternalAuth}
          onNavigateBlog={handleNavigateToBlog}
        />
        <HeroSection
          onNavigateToSignUp={handleExternalAuth}
          onNavigateToTerms={() => navigateToPage('terms-conditions')}
          onNavigateToPrivacy={() => navigateToPage('privacy-policy')}
        />
        <ServicesSection onNavigateToSignUp={handleExternalAuth} />
        <WhyChooseUs />
        <CustomerReviews onNavigateToSignUp={handleExternalAuth} />
        <Footer
          onNavigateToShippingPolicy={() => navigateToPage('shipping-policy')}
          onNavigateToWarrantyPolicy={() => navigateToPage('warranty-policy')}
          onNavigateToTermsConditions={() => navigateToPage('terms-conditions')}
          onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
          onNavigateToAbout={() => navigateToPage('about')}
        />
      </div>
      <CookieConsent
        onNavigateToPrivacyPolicy={() => navigateToPage('privacy-policy')}
      />
    </div>
  );
}
