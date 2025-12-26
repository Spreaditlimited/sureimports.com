import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mail, CheckCircle, Clock, Shield } from 'lucide-react';
import sureImportsLogo from '../../../public/images/new/images/logo.png';

interface SignUpSuccessProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function SignUpSuccess({
  onNavigateToSignIn,
  onNavigateHome,
}: SignUpSuccessProps) {
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

        {/* Success Message */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl text-white">
                  Account Created Successfully!
                </h1>
                <p className="text-gray-400">
                  Welcome to Sure Imports! Your account has been created, but we
                  need to verify your email address before you can start
                  sourcing.
                </p>
              </div>

              {/* Email Verification Steps */}
              <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div className="text-left">
                    <h3 className="font-medium text-white">Check Your Email</h3>
                    <p className="text-sm text-gray-400">
                      We've sent a verification email to your inbox. Click the
                      link in the email to activate your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-yellow-400" />
                  <div className="text-left">
                    <h3 className="font-medium text-white">
                      Verify Within 24 Hours
                    </h3>
                    <p className="text-sm text-gray-400">
                      The verification link will expire in 24 hours. If it
                      expires, you can request a new one.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-green-400" />
                  <div className="text-left">
                    <h3 className="font-medium text-white">Account Security</h3>
                    <p className="text-sm text-gray-400">
                      Email verification helps us keep your account secure and
                      ensures you receive important updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="rounded-lg border border-blue-700/50 bg-blue-900/20 p-4">
                <h3 className="mb-2 font-medium text-blue-300">
                  Important Notice
                </h3>
                <p className="text-sm text-blue-200">
                  You won't be able to sign in to your account until you verify
                  your email address. If you don't see the email, check your
                  spam/junk folder.
                </p>
              </div>

              {/* Contact Support */}
              <div className="space-y-3 text-center">
                <p className="text-sm text-gray-400">
                  Didn't receive the verification email?
                </p>
                <p className="text-sm text-gray-400">
                  Contact our support team at{' '}
                  <a
                    href="mailto:hello@sureimports.com"
                    className="text-blue-400 transition-colors hover:text-blue-300"
                  >
                    hello@sureimports.com
                  </a>
                </p>
              </div>

              <Button
                onClick={onNavigateToSignIn}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Continue to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
