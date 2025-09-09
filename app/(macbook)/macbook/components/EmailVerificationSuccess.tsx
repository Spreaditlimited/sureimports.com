import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { CheckCircle, UserCheck, ArrowRight } from "lucide-react";
import sureImportsLogo from "../../../public/images/new/images/logo.png";

interface EmailVerificationSuccessProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function EmailVerificationSuccess({ onNavigateToSignIn, onNavigateHome }: EmailVerificationSuccessProps) {
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
              <img 
                src={sureImportsLogo as any} 
                alt="Sure Imports" 
                className="h-8 opacity-90"
              />
            </button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <CheckCircle className="w-20 h-20 text-green-500" />
                  <UserCheck className="w-8 h-8 text-white absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-white text-2xl">Email Verified Successfully!</h1>
                <p className="text-gray-400">
                  Congratulations! Your email has been verified and your Sure Imports account is now fully activated.
                </p>
              </div>

              {/* Account Benefits */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <h3 className="text-white font-medium mb-3">Your account is now ready for:</h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">Browse and source products from Chinese suppliers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">Access exclusive deals and wholesale pricing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">Get personalized sourcing assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">Track your orders and shipments</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">Join our community of 40,000+ businesses</span>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">Welcome to Sure Imports!</h3>
                <p className="text-blue-200 text-sm">
                  We're excited to help you discover quality products from China. 
                  Sign in now to start your sourcing journey with confidence.
                </p>
              </div>

              <Button 
                onClick={onNavigateToSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white group"
              >
                Sign In to Your Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Contact Support */}
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Need help getting started?{" "}
                  <a 
                    href="mailto:hello@sureimports.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
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