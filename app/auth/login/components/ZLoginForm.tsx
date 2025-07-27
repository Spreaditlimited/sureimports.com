'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(userEmail, userPassword);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex min-h-screen w-full">
        {/* Left Section */}
        <div className="relative hidden flex-col bg-gradient-to-br from-purple-200 via-blue-100 to-blue-300 p-0 lg:flex lg:w-1/2">
          <div className="relative h-full w-full">
            <img
              src="/assets/images/auth/bkg.jpg"
              alt="Background Image"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlay logo with background */}
          <div className="absolute left-4 top-4 rounded-full bg-white bg-opacity-20 p-2">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={300}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Overlay text at the footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-center text-white">
            <h2 className="text-xl font-bold">SureImports Admin Panel</h2>
            <p className="text-sm">© 2025. All Rights Reserved.</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="w-32">
              <Image
                src="/assets/images/logos/logo1.png"
                alt="Printin.ng Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-blue-600">SIGN IN</h1>
              <p className="text-gray-500">
                Enter your email and password to login
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-blue-600 dark:text-gray-700"
                      placeholder="Enter Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 focus:border-transparent focus:ring-2 focus:ring-blue-600 dark:text-gray-700"
                      placeholder="Enter Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-500"
                >
                  Keep me logged-in for 1 week
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-orange-300 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-orange-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                {isLoading ? 'Connecting . . .' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
