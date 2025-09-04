"use client";

import { useState, useEffect } from 'react';
import { useAdminAuth, AdminUser } from './AdminAuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, User, Mail, Eye, EyeOff, Lock, Save } from 'lucide-react';

interface AdminEditProfileProps {
  onEditSuccess: () => void;
  onCancel: () => void;
}

export function AdminEditProfile({ onEditSuccess, onCancel }: AdminEditProfileProps) {
  const { currentAdmin, getSelectedAdmin, updateAdminProfile } = useAdminAuth();
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user is super admin
  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  useEffect(() => {
    // Get the selected admin from AdminUserManagement
    const admin = getSelectedAdmin();
    if (admin) {
      setSelectedAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [getSelectedAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email
      };

      // Only include password if it's being changed
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const result = await updateAdminProfile(selectedAdmin.id, updateData);

      if (result.success) {
        setSuccess('Admin profile updated successfully!');
        setTimeout(() => {
          onEditSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to update admin profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">Access Denied</CardTitle>
              <CardDescription>
                Only super administrators can edit admin profiles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onCancel}
                className="w-full"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">No Admin Selected</CardTitle>
              <CardDescription>
                Please select an admin to edit from the admin management page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={onCancel}
                className="w-full"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Management
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Management
          </button>
        </div>

        {/* Main card */}
        <Card className="border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Edit Admin Profile</CardTitle>
              <CardDescription>
                Update administrator information and settings
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
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
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
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="font-medium">Change Password (Optional)</h3>
                <p className="text-sm text-muted-foreground">Leave blank to keep current password</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Min. 8 characters"
                        disabled={isLoading}
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        placeholder="Repeat new password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}