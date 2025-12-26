'use client';

import { useState } from 'react';
import { useAdminAuth, AdminPermissions } from './AdminAuthProvider';
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
import { Checkbox } from './ui/checkbox';
import {
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
} from 'lucide-react';

interface AdminSignUpProps {
  onSignUpSuccess: () => void;
  onBackToSignIn: () => void;
  isStandalone?: boolean;
}

export function AdminSignUp({
  onSignUpSuccess,
  onBackToSignIn,
  isStandalone = false,
}: AdminSignUpProps) {
  const { createAdmin, currentAdmin } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [permissions, setPermissions] = useState<AdminPermissions>({
    overview: false,
    products: false,
    orders: false,
    customers: false,
    reports: false,
    bulkOrders: false,
    returns: false,
    userManagement: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user is super admin
  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Check if at least one permission is selected
    if (!Object.values(permissions).some((p) => p)) {
      setError('Please select at least one permission');
      setIsLoading(false);
      return;
    }

    try {
      const result = await createAdmin(
        {
          name: formData.name,
          email: formData.email,
          role: 'admin',
          permissions,
        },
        formData.password,
      );

      if (result.success) {
        setSuccess('Admin account created successfully!');
        // Reset form
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setPermissions({
          overview: false,
          products: false,
          orders: false,
          customers: false,
          reports: false,
          bulkOrders: false,
          returns: false,
          userManagement: false,
        });
        setTimeout(() => {
          onSignUpSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create admin account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handlePermissionChange = (
    permission: keyof AdminPermissions,
    checked: boolean,
  ) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
    if (error) setError('');
  };

  const permissionLabels: Record<
    keyof AdminPermissions,
    { label: string; description: string }
  > = {
    overview: {
      label: 'Dashboard Overview',
      description: 'View dashboard metrics and analytics',
    },
    products: {
      label: 'Product Management',
      description: 'Add, edit, and delete products',
    },
    orders: {
      label: 'Order Management',
      description: 'View and manage customer orders',
    },
    customers: {
      label: 'Customer Analytics',
      description: 'View customer data and analytics',
    },
    reports: {
      label: 'Financial Reports',
      description: 'Access financial reports and data',
    },
    bulkOrders: {
      label: 'Bulk Orders',
      description: 'Create and manage bulk orders',
    },
    returns: {
      label: 'Returns Management',
      description: 'Handle product returns and refunds',
    },
    userManagement: {
      label: 'User Management',
      description: 'Manage admin users (Super Admin only)',
    },
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">
                Access Denied
              </CardTitle>
              <CardDescription>
                Only super administrators can create new admin accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onBackToSignIn}
                className="w-full"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isStandalone ? 'Back to Admin Management' : 'Back to Sign In'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToSignIn}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {isStandalone ? 'Back to Admin Management' : 'Back to Sign In'}
          </button>
        </div>

        {/* Main card */}
        <Card className="border-2">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <UserPlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Create Admin Account</CardTitle>
              <CardDescription>
                Set up a new administrator with custom permissions
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="pl-10"
                      placeholder="Enter full name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="pl-10"
                      placeholder="admin@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange('password', e.target.value)
                        }
                        className="pl-10 pr-10"
                        placeholder="Min. 8 characters"
                        required
                        disabled={isLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange('confirmPassword', e.target.value)
                        }
                        className="pl-10 pr-10"
                        placeholder="Repeat password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="font-medium">Dashboard Permissions</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(permissionLabels).map(
                    ([key, { label, description }]) => {
                      const permissionKey = key as keyof AdminPermissions;
                      // Only super admin can assign user management permissions
                      if (permissionKey === 'userManagement') return null;

                      return (
                        <div
                          key={permissionKey}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={permissionKey}
                            checked={permissions[permissionKey]}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(permissionKey, !!checked)
                            }
                            disabled={isLoading}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={permissionKey}
                              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
