import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, UserCheck, ArrowRight } from 'lucide-react';
import sureImportsLogo from '../../../public/images/new/images/logo.png';

interface EmailVerificationSuccessProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function EmailVerificationSuccess({
  onNavigateToSignIn,
  onNavigateHome,
}: EmailVerificationSuccessProps) {
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
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                  <UserCheck className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-800 p-1 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl text-white">
                  Email Verified Successfully!
                </h1>
                <p className="text-gray-400">
                  Congratulations! Your email has been verified and your Sure
                  Imports account is now fully activated.
                </p>
              </div>

              {/* Account Benefits */}
              <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/50 p-6">
                <h3 className="mb-3 font-medium text-white">
                  Your account is now ready for:
                </h3>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Browse and source products from Chinese suppliers
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Access exclusive deals and wholesale pricing
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Get personalized sourcing assistance
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Track your orders and shipments
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">
                      Join our community of 40,000+ businesses
                    </span>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="rounded-lg border border-blue-700/50 bg-blue-900/20 p-4">
                <h3 className="mb-2 font-medium text-blue-300">
                  Welcome to Sure Imports!
                </h3>
                <p className="text-sm text-blue-200">
                  We're excited to help you discover quality products from
                  China. Sign in now to start your sourcing journey with
                  confidence.
                </p>
              </div>

              <Button
                onClick={onNavigateToSignIn}
                className="group w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign In to Your Account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Contact Support */}
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Need help getting started?{' '}
                  <a
                    href="mailto:hello@sureimports.com"
                    className="text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
