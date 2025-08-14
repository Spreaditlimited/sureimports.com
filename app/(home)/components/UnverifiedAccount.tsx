import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mail, AlertCircle, Send, CheckCircle, ArrowLeft } from "lucide-react";

interface UnverifiedAccountProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
  userEmail?: string;
}

export default function UnverifiedAccount({ onNavigateToSignIn, onNavigateHome, userEmail = "user@example.com" }: UnverifiedAccountProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      setCooldown(60); // 60 second cooldown
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="transition-opacity hover:opacity-80"
            >
              {/* Use public path string for image */}
              <img 
                src="/images/affiliate-dashboard.png" 
                alt="Sure Imports" 
                className="h-8 opacity-90"
              />
            </button>
          </div>
        </div>

        {/* Unverified Account Message */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <AlertCircle className="w-20 h-20 text-yellow-500" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-white text-2xl">Email Verification Required</h1>
                <p className="text-gray-400">
                  Your account exists but hasn't been verified yet. Please verify your email address to access your Sure Imports account.
                </p>
              </div>

              {/* Account Email */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{userEmail}</span>
                </div>
              </div>

              {/* Email Sent Confirmation */}
              {emailSent && (
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Verification Email Sent!</span>
                  </div>
                  <p className="text-green-200 text-sm">
                    Check your inbox and click the verification link. Don't forget to check your spam folder.
                  </p>
                </div>
              )}

              {/* Why Verification is Important */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 text-left">
                <h3 className="text-blue-300 font-medium mb-3">Why do we need email verification?</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-blue-200 text-sm">Protect your account from unauthorized access</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-blue-200 text-sm">Ensure you receive important order and shipping updates</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-blue-200 text-sm">Comply with security and fraud prevention standards</span>
                  </div>
                </div>
              </div>

              {/* Resend Email Button */}
              <div className="space-y-3">
                <Button 
                  onClick={handleResendEmail}
                  disabled={isLoading || cooldown > 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                {!emailSent && (
                  <p className="text-gray-500 text-sm">
                    Didn't receive the original email? We can send another one.
                  </p>
                )}
              </div>

              {/* Contact Support */}
              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Still having trouble? Contact our support team:
                </p>
                <p className="text-gray-400 text-sm">
                  <a 
                    href="mailto:hello@sureimports.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    hello@sureimports.com
                  </a>
                </p>
              </div>

              {/* Back to Sign In */}
              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={onNavigateToSignIn}
                  className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}