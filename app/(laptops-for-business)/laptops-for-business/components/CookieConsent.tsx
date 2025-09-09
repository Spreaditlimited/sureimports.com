import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Cookie } from "lucide-react";

interface CookieConsentProps {
  onNavigateToPrivacyPolicy: () => void;
}

export default function CookieConsent({ onNavigateToPrivacyPolicy }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    handleClose();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
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
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ease-out ${
      isClosing ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
    }`}>
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl">
          {/* Glass-morphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          
          <div className="relative p-6 pr-14">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Icon and content */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Cookie className="w-6 h-6 text-blue-400" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-white font-semibold text-lg">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We use cookies and similar technologies to provide the best experience on our website. 
                    These help us analyze site usage, personalize content, and improve our services. 
                    By continuing to browse, you agree to our use of cookies.{" "}
                    <button
                      onClick={onNavigateToPrivacyPolicy}
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    >
                      Learn more in our Privacy Policy
                    </button>
                  </p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="bg-transparent border-slate-600 text-gray-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-500 transition-all px-6"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-lg shadow-blue-600/20 transition-all"
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