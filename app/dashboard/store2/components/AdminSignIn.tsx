"use client";

import { useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { Eye, EyeOff, ArrowLeft, Shield, Lock, Mail } from 'lucide-react';

interface AdminSignInProps {
  onSignInSuccess: () => void;
  onBackToStore: () => void;
  onShowSignUp: () => void;
  onShowResetPassword: () => void;
}

export function AdminSignIn({ 
  onSignInSuccess, 
  onBackToStore, 
  onShowSignUp, 
  onShowResetPassword 
}: AdminSignInProps) {
  const { signIn } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        onSignInSuccess();
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store
          </button>
        </div>

        {/* Main card */}
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Sign In</CardTitle>
              <CardDescription>
                Access the administrative dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    placeholder="admin@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="space-y-3 text-center">
              <button
                onClick={onShowResetPassword}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
              
              <div className="text-sm text-muted-foreground">
                Need to create an admin account?{' '}
                <button
                  onClick={onShowSignUp}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:underline font-medium"
                  disabled={isLoading}
                >
                  Request Access
                </button>
              </div>
            </div>

            {/* Default credentials info */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Default Super Admin Credentials:</h4>
              <div className="space-y-1 text-sm text-muted-foreground font-mono">
                <div>Email: superadmin@buygadgets.com</div>
                <div>Password: SuperAdmin2025!</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}