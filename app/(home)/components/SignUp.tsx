'use client';

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
import { Checkbox } from './ui/checkbox';
import { Mail, Lock, User, Eye, EyeOff, Phone, Shield } from 'lucide-react';

interface SignUpProps {
  onNavigateToSignIn?: () => void;
  onNavigateToSignUpSuccess?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateHome?: () => void;
}

export default function SignUp({
  onNavigateToSignIn,
  onNavigateToSignUpSuccess,
  onNavigateToTerms,
  onNavigateToPrivacy,
  onNavigateHome,
}: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate email on change
    if (field === 'email') {
      if (value.trim() === '') {
        setEmailError('');
      } else if (!isValidEmail(value)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    if (!isValidEmail(formData.email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNavigateToSignUpSuccess?.();
    }, 2000);
  };

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
                src="/images/logo.png"
                alt="Sure Imports"
                className="h-8 opacity-90"
              />
            </button>
          </div>
          <h1 className="text-2xl text-white">Create your account</h1>
          <p className="text-gray-400">
            Join thousands of businesses sourcing from China
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="overflow-hidden border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white">Sign Up</CardTitle>
            <CardDescription className="text-gray-400">
              Create your Sure Imports account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className="border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    className="border-slate-700 bg-slate-900 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="min-w-0 space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-gray-500 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                </div>
                {emailError && (
                  <div className="overflow-wrap-anywhere mt-1 w-full max-w-full hyphens-auto break-all text-xs text-red-400">
                    {emailError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-slate-700 bg-slate-900 pl-10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className="border-slate-700 bg-slate-900 pl-10 pr-10 text-white placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className="border-slate-700 bg-slate-900 pl-10 pr-10 text-white placeholder:text-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Enhanced Terms and Privacy Section */}
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/30 p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) =>
                        setAgreeToTerms(checked === true)
                      }
                      className="mt-0.5 border-slate-600 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                    />
                    <div className="flex-1 space-y-2">
                      <Label
                        htmlFor="terms"
                        className="block cursor-pointer leading-relaxed text-gray-300"
                      >
                        I agree to Sure Imports' legal agreements
                      </Label>
                      <div className="flex flex-wrap items-center gap-1 text-sm">
                        <span className="text-gray-500">Read our</span>
                        <button
                          type="button"
                          onClick={onNavigateToTerms}
                          className="text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300 hover:underline-offset-4"
                        >
                          Terms & Conditions
                        </button>
                        <span className="text-gray-500">and</span>
                        <button
                          type="button"
                          onClick={onNavigateToPrivacy}
                          className="text-blue-400 underline underline-offset-2 transition-colors hover:text-blue-300 hover:underline-offset-4"
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start space-x-2 text-xs text-gray-500">
                  <Shield className="mt-0.5 h-3 w-3 flex-shrink-0" />
                  <span className="leading-relaxed">
                    Your data is protected with industry-standard encryption and
                    we never share your information with third parties.
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white transition-all duration-200 hover:bg-blue-700"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 border-t border-slate-700/50 pt-6">
              <div className="text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={onNavigateToSignIn}
                    className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
