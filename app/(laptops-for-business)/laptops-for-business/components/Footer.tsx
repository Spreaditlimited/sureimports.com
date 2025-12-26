import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import sureImportsLogo from '../../../public/images/new/images/logo.png';
import { useState } from 'react';

interface FooterProps {
  onNavigateToShippingPolicy?: () => void;
  onNavigateToWarrantyPolicy?: () => void;
  onNavigateToTermsConditions?: () => void;
  onNavigateToPrivacyPolicy?: () => void;
  onNavigateToAbout?: () => void;
}

export default function Footer({
  onNavigateToShippingPolicy,
  onNavigateToWarrantyPolicy,
  onNavigateToTermsConditions,
  onNavigateToPrivacyPolicy,
  onNavigateToAbout,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only proceed if email is valid (button should be disabled if not)
    if (!email.trim() || !isValidEmail(email)) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to email list service
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate successful subscription
      setIsSubscribed(true);
      setEmail('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={sureImportsLogo as any}
                alt="Sure Imports"
                className="h-6 opacity-90"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted partner for China product sourcing. We connect
              businesses with verified Chinese suppliers and manufacturers,
              ensuring quality and reliability.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                <a
                  href="mailto:hello@sureimports.com"
                  className="text-sm text-gray-400 transition-colors hover:text-blue-400"
                >
                  hello@sureimports.com
                </a>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                  <div className="text-sm">
                    <p className="font-medium text-white">Nigeria Office:</p>
                    <p className="text-gray-400">
                      5 Olutosin Ajay Street, Ajao Estate, Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="ml-6 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-400">08037649956</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-400">08064583664</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-400">08068397263</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
                <div className="text-sm">
                  <p className="font-medium text-white">China Office:</p>
                  <p className="text-gray-400">
                    广州市白云区机场路111号建发广场5FB3-1
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Legal & Support</h3>
            <div className="space-y-2">
              <button
                onClick={onNavigateToAbout}
                className="block text-left text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                About
              </button>
              <button
                onClick={onNavigateToTermsConditions}
                className="block text-left text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                Terms & Conditions
              </button>
              <button
                onClick={onNavigateToPrivacyPolicy}
                className="block text-left text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                Privacy Policy
              </button>
              <button
                onClick={onNavigateToWarrantyPolicy}
                className="block text-left text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                Warranty Policy
              </button>
              <button
                onClick={onNavigateToShippingPolicy}
                className="block text-left text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                Shipping Policy
              </button>
              <a
                href="https://affiliate.sureimports.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-gray-400 transition-colors hover:text-blue-400"
              >
                Affiliates
              </a>
            </div>
          </div>

          {/* Stay Connected */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Stay Connected</h3>
            <p className="text-sm text-gray-400">
              Get the latest updates on China sourcing opportunities and
              industry insights.
            </p>

            {/* Email Subscription */}
            <div className="space-y-2">
              {isSubscribed ? (
                <div className="rounded-lg border border-green-600/20 bg-green-600/10 p-3">
                  <p className="text-center text-sm text-green-400">
                    Thank you for subscribing! 🎉
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleSubscribe} className="flex space-x-2">
                    <div className="min-w-0 flex-1">
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border-slate-700 bg-slate-900 text-sm text-white placeholder:text-gray-500 disabled:opacity-50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || !email.trim() || !isValidEmail(email)
                      }
                      className="flex-shrink-0 bg-blue-600 px-4 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? '...' : 'Subscribe'}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Follow Us</p>
              <div className="flex space-x-3">
                <a
                  href="https://www.facebook.com/share/1BEjP95X7E/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 transition-colors hover:bg-blue-600"
                >
                  <Facebook className="h-4 w-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://www.instagram.com/sureimport?igsh=NjRtaHJpbXlnMGxo&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 transition-colors hover:bg-pink-600"
                >
                  <Instagram className="h-4 w-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://www.tiktok.com/@tochukwunkwocha?_t=ZS-8yeC5xnNBmH&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 transition-colors hover:bg-black"
                >
                  <TikTokIcon className="h-4 w-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://youtube.com/@sureimports?si=gP4cw3zUC1iQN3Rd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 transition-colors hover:bg-red-600"
                >
                  <Youtube className="h-4 w-4 text-gray-400 hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 Sure Imports Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end">
              <button
                onClick={onNavigateToTermsConditions}
                className="text-sm text-gray-500 transition-colors hover:text-blue-400"
              >
                Terms & Conditions
              </button>
              <button
                onClick={onNavigateToPrivacyPolicy}
                className="text-sm text-gray-500 transition-colors hover:text-blue-400"
              >
                Privacy Policy
              </button>
              <button
                onClick={onNavigateToShippingPolicy}
                className="text-sm text-gray-500 transition-colors hover:text-blue-400"
              >
                Shipping Policy
              </button>
              <button
                onClick={onNavigateToWarrantyPolicy}
                className="text-sm text-gray-500 transition-colors hover:text-blue-400"
              >
                Warranty Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
