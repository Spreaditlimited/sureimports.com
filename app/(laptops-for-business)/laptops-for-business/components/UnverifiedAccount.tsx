import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mail, AlertCircle, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import sureImportsLogo from '../../../public/images/new/images/logo.png';

interface UnverifiedAccountProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
  userEmail?: string;
}

export default function UnverifiedAccount({
  onNavigateToSignIn,
  onNavigateHome,
  userEmail = 'user@example.com',
}: UnverifiedAccountProps) {
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
        setCooldown((prev) => {
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
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={sureImportsLogo as any}
                alt="Sure Imports"
                className="h-8 opacity-90"
              />
            </button>
          </div>
        </div>

        {/* Unverified Account Message */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <AlertCircle className="h-20 w-20 text-yellow-500" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl text-white">
                  Email Verification Required
                </h1>
                <p className="text-gray-400">
                  Your account exists but hasn't been verified yet. Please
                  verify your email address to access your Sure Imports account.
                </p>
              </div>

              {/* Account Email */}
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-white">{userEmail}</span>
                </div>
              </div>

              {/* Email Sent Confirmation */}
              {emailSent && (
                <div className="rounded-lg border border-green-700/50 bg-green-900/20 p-4">
                  <div className="mb-2 flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-green-300">
                      Verification Email Sent!
                    </span>
                  </div>
                  <p className="text-sm text-green-200">
                    Check your inbox and click the verification link. Don't
                    forget to check your spam folder.
                  </p>
                </div>
              )}

              {/* Why Verification is Important */}
              <div className="rounded-lg border border-blue-700/50 bg-blue-900/20 p-4 text-left">
                <h3 className="mb-3 font-medium text-blue-300">
                  Why do we need email verification?
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-blue-200">
                      Protect your account from unauthorized access
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-blue-200">
                      Ensure you receive important order and shipping updates
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-blue-200">
                      Comply with security and fraud prevention standards
                    </span>
                  </div>
                </div>
              </div>

              {/* Resend Email Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isLoading || cooldown > 0}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : cooldown > 0 ? (
                    `Resend in ${cooldown}s`
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>

                {!emailSent && (
                  <p className="text-sm text-gray-500">
                    Didn't receive the original email? We can send another one.
                  </p>
                )}
              </div>

              {/* Contact Support */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-gray-400">
                  Still having trouble? Contact our support team:
                </p>
                <p className="text-sm text-gray-400">
                  <a
                    href="mailto:hello@sureimports.com"
                    className="text-blue-400 transition-colors hover:text-blue-300"
                  >
                    hello@sureimports.com
                  </a>
                </p>
              </div>

              {/* Back to Sign In */}
              <div className="border-t border-slate-700 pt-4">
                <button
                  onClick={onNavigateToSignIn}
                  className="flex w-full items-center justify-center text-gray-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
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
