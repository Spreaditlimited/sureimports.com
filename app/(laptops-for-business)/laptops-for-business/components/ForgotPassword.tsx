import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import sureImportsLogo from '../../../public/images/new/images/logo.png';

interface ForgotPasswordProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function ForgotPassword({
  onNavigateToSignIn,
  onNavigateHome,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleBackToSignIn = () => {
    setEmailSent(false);
    onNavigateToSignIn?.();
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
        <div className="w-full max-w-md space-y-6">
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
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl text-white">Check your email</h1>
                  <p className="text-gray-400">
                    We've sent a password reset link to{' '}
                    <span className="font-medium text-white">{email}</span>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                  <p className="text-sm text-gray-400">
                    Didn't receive the email? Check your spam folder or contact
                    support at{' '}
                    <a
                      href="mailto:hello@sureimports.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      hello@sureimports.com
                    </a>
                  </p>
                </div>
                <Button
                  onClick={handleBackToSignIn}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
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
          <h1 className="text-2xl text-white">Forgot your password?</h1>
          <p className="text-gray-400">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6">
              <button
                onClick={onNavigateToSignIn}
                className="flex w-full items-center justify-center text-gray-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
