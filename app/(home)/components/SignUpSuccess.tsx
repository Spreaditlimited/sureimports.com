"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mail, CheckCircle, Clock, Shield } from "lucide-react";
import sureImportsLogo from "../public/images/affiliate-ashboard.png";

interface SignUpSuccessProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function SignUpSuccess({ onNavigateToSignIn, onNavigateHome }: SignUpSuccessProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="transition-opacity hover:opacity-80"
              type="button"
            >
              <Image
                src={sureImportsLogo}
                alt="Sure Imports"
                className="h-8 w-auto opacity-90"
                priority
              />
            </button>
          </div>
        </div>

        {/* Success Message */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-white text-2xl">Account Created Successfully!</h1>
                <p className="text-gray-400">
                  Welcome to Sure Imports! Your account has been created, but we need to verify your email address before you can start sourcing.
                </p>
              </div>

              {/* Email Verification Steps */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="text-white font-medium">Check Your Email</h3>
                    <p className="text-gray-400 text-sm">
                      We've sent a verification email to your inbox. Click the link in the email to activate your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="text-white font-medium">Verify Within 24 Hours</h3>
                    <p className="text-gray-400 text-sm">
                      The verification link will expire in 24 hours. If it expires, you can request a new one.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="text-white font-medium">Account Security</h3>
                    <p className="text-gray-400 text-sm">
                      Email verification helps us keep your account secure and ensures you receive important updates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <h3 className="text-blue-300 font-medium mb-2">Important Notice</h3>
                <p className="text-blue-200 text-sm">
                  You won't be able to sign in to your account until you verify your email address. 
                  If you don't see the email, check your spam/junk folder.
                </p>
              </div>

              {/* Contact Support */}
              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Didn't receive the verification email?
                </p>
                <p className="text-gray-400 text-sm">
                  Contact our support team at{" "}
                  <a 
                    href="mailto:hello@sureimports.com" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    hello@sureimports.com
                  </a>
                </p>
              </div>

              <Button 
                onClick={onNavigateToSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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