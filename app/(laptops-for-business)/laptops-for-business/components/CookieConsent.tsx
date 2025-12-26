import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Cookie } from 'lucide-react';

interface CookieConsentProps {
  onNavigateToPrivacyPolicy: () => void;
}

export default function CookieConsent({
  onNavigateToPrivacyPolicy,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    handleClose();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ease-out ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
          {/* Glass-morphism overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="group absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/50 transition-colors hover:bg-slate-700/50"
          >
            <X className="h-4 w-4 text-gray-400 transition-colors group-hover:text-white" />
          </button>

          <div className="relative p-6 pr-14">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Icon and content */}
              <div className="flex flex-1 items-start gap-4">
                <div className="mt-1 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20">
                  <Cookie className="h-6 w-6 text-blue-400" />
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    We use cookies and similar technologies to provide the best
                    experience on our website. These help us analyze site usage,
                    personalize content, and improve our services. By continuing
                    to browse, you agree to our use of cookies.{' '}
                    <button
                      onClick={onNavigateToPrivacyPolicy}
                      className="text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300"
                    >
                      Learn more in our Privacy Policy
                    </button>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="border-slate-600 bg-transparent px-6 text-gray-300 transition-all hover:border-slate-500 hover:bg-slate-800/50 hover:text-white"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-blue-600 px-6 text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700"
                >
                  Accept Cookies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
