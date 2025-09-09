import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import sureImportsLogo from "figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png";

interface ForgotPasswordProps {
  onNavigateToSignIn?: () => void;
  onNavigateHome?: () => void;
}

export default function ForgotPassword({ onNavigateToSignIn, onNavigateHome }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <button
                onClick={onNavigateHome}
                className="transition-opacity hover:opacity-80"
              >
                <img 
                  src={sureImportsLogo} 
                  alt="Sure Imports" 
                  className="h-8 opacity-90"
                />
              </button>
            </div>
          </div>

          {/* Success Message */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-white text-xl">Check your email</h1>
                  <p className="text-gray-400">
                    We've sent a password reset link to{" "}
                    <span className="text-white font-medium">{email}</span>
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">
                    Didn't receive the email? Check your spam folder or contact support at{" "}
                    <a href="mailto:hello@sureimports.com" className="text-blue-400 hover:text-blue-300">
                      hello@sureimports.com
                    </a>
                  </p>
                </div>
                <Button 
                  onClick={handleBackToSignIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <button
              onClick={onNavigateHome}
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src={sureImportsLogo} 
                alt="Sure Imports" 
                className="h-8 opacity-90"
              />
            </button>
          </div>
          <h1 className="text-white text-2xl">Forgot your password?</h1>
          <p className="text-gray-400">No worries, we'll send you reset instructions</p>
        </div>

        {/* Forgot Password Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6">
              <button
                onClick={onNavigateToSignIn}
                className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}