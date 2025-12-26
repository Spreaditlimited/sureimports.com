'use client';

import { useState } from 'react';
import { useAdminAuth } from './AdminAuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

interface AdminResetPasswordProps {
  onResetSuccess: () => void;
  onBackToSignIn: () => void;
}

export function AdminResetPassword({
  onResetSuccess,
  onBackToSignIn,
}: AdminResetPasswordProps) {
  const { resetPassword } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess(
          'Password reset instructions have been sent. Please check the alert for your temporary password.',
        );
        setTimeout(() => {
          onResetSuccess();
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToSignIn}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </button>
        </div>

        {/* Main card */}
        <Card className="border-2">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <KeyRound className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your admin email address and we'll help you reset your
                password
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

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your admin email"
                    required
                    disabled={isLoading || !!success}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the email address associated with your admin account
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !!success}
              >
                {isLoading
                  ? 'Sending Reset...'
                  : success
                    ? 'Reset Sent!'
                    : 'Send Reset Instructions'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <button
                  onClick={onBackToSignIn}
                  className="font-medium text-green-600 hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300"
                  disabled={isLoading}
                >
                  Sign In Instead
                </button>
              </p>
            </div>

            {/* Info about temporary password */}
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> In this demo, temporary passwords are
                shown directly in an alert. In a production environment, reset
                instructions would be sent via email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
