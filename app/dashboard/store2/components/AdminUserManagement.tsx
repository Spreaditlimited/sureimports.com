"use client";

import { useState, useEffect } from 'react';
import { useAdminAuth, AdminUser, AdminPermissions } from './AdminAuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { MobileHeader } from './MobileHeader';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Package,
  Edit,
  MoreVertical
} from 'lucide-react';

interface AdminUserManagementProps {
  onCreateNewAdmin: () => void;
  onEditAdmin?: () => void;
  onBackToAdmin?: () => void;
  onBackToStore?: () => void;
  onBulkBuyer?: () => void;
}

export function AdminUserManagement({ 
  onCreateNewAdmin, 
  onEditAdmin,
  onBackToAdmin, 
  onBackToStore,
  onBulkBuyer 
}: AdminUserManagementProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { 
    currentAdmin, 
    admins, 
    updateAdminPermissions, 
    deleteAdmin,
    setSelectedAdmin 
  } = useAdminAuth();
  const [localSelectedAdmin, setLocalSelectedAdmin] = useState<AdminUser | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<AdminPermissions | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEditPermissions = (admin: AdminUser) => {
    setLocalSelectedAdmin(admin);
    setEditingPermissions(admin.permissions);
    setError('');
    setSuccess('');
  };

  const handleSavePermissions = async () => {
    if (!localSelectedAdmin || !editingPermissions) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await updateAdminPermissions(localSelectedAdmin.id, editingPermissions);
      if (result.success) {
        setSuccess('Permissions updated successfully!');
        setLocalSelectedAdmin(null);
        setEditingPermissions(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update permissions');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    setIsLoading(true);
    setError('');

    try {
      const result = await deleteAdmin(adminToDelete.id);
      if (result.success) {
        setSuccess(`Admin ${adminToDelete.name} has been deleted successfully!`);
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete admin');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (permission: keyof AdminPermissions, checked: boolean) => {
    if (!editingPermissions) return;
    setEditingPermissions(prev => prev ? { ...prev, [permission]: checked } : null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPermissionCount = (permissions: AdminPermissions) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  const permissionLabels: Record<keyof AdminPermissions, string> = {
    overview: 'Dashboard Overview',
    products: 'Product Management',
    orders: 'Order Management',
    customers: 'Customer Analytics',
    reports: 'Financial Reports',
    bulkOrders: 'Bulk Orders',
    returns: 'Returns Management',
    userManagement: 'User Management'
  };

  const handleBackButtonClick = () => {
    if (onBackToAdmin) {
      onBackToAdmin();
    } else if (onBackToStore) {
      onBackToStore();
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-background">
        {isMobile && <MobileHeader />}
        <div className={`${isMobile ? 'px-5 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                Only super administrators can manage admin users.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <MobileHeader />
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-background border-b border-border">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackButtonClick}
                className="bg-slate-600 hover:bg-slate-700 dark:bg-muted dark:hover:bg-muted/80 transition-colors flex items-center justify-center w-10 h-10 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-white dark:text-foreground" />
              </button>
              <div>
                <h1 className="font-medium text-foreground">Admin Management</h1>
                <p className="text-xs text-muted-foreground">Manage admin accounts</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Desktop Header */
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToAdmin || onBackToStore}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {onBackToAdmin ? 'Back to Dashboard' : 'Back to Store'}
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Admin User Management</h1>
                  <p className="text-xs text-muted-foreground">
                    Manage administrator accounts and permissions
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={onCreateNewAdmin}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Admin
                </Button>
                
                {onBulkBuyer && (
                  <button
                    onClick={onBulkBuyer}
                    className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-sm"
                  >
                    <Package className="w-4 h-4" />
                    Bulk Buyer?
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? 'px-5 py-4 pb-6' : 'max-w-7xl mx-auto p-6'}`}>
        <div className="space-y-6">

          {/* Alerts */}
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

          {/* Stats Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
            <Card>
              <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Total Admins</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-medium`}>{admins.length}</div>
                <p className="text-sm text-muted-foreground">
                  {admins.filter(a => a.role === 'super_admin').length} super admin(s)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Active Sessions</CardTitle>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-medium`}>
                  {admins.filter(a => a.lastLogin).length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Recent activity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Regular Admins</CardTitle>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-medium`}>
                  {admins.filter(a => a.role === 'admin').length}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isMobile ? 'Non-super admins' : 'Non-super admin accounts'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Create Admin Button - Mobile Only */}
          {isMobile && (
            <Button 
              onClick={onCreateNewAdmin}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              size="lg"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Admin
            </Button>
          )}

          {/* Admin List */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-base' : ''}`}>
                <Users className="h-5 w-5" />
                Administrator Accounts
              </CardTitle>
              <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>
                Manage permissions and settings for all admin accounts
              </CardDescription>
            </CardHeader>
            <CardContent className={`${isMobile ? 'p-3' : 'space-y-4'}`}>
              {admins.map((admin, index) => (
                <div key={admin.id}>
                  <div className={`${isMobile ? 'space-y-3' : 'flex items-center justify-between'} p-4 rounded-lg border`}>
                    <div className={`flex items-center ${isMobile ? 'space-x-3' : 'space-x-4'}`}>
                      <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`}>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`space-y-1 ${isMobile ? 'flex-1' : ''}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{admin.name}</h3>
                          {admin.role === 'super_admin' && (
                            <Badge className={`bg-gold-100 text-gold-800 border-gold-200 ${isMobile ? 'text-xs' : ''}`}>
                              <ShieldCheck className={`${isMobile ? 'h-2 w-2' : 'h-3 w-3'} mr-1`} />
                              Super Admin
                            </Badge>
                          )}
                          {admin.id === currentAdmin?.id && (
                            <Badge variant="outline" className={`${isMobile ? 'text-xs' : ''}`}>You</Badge>
                          )}
                        </div>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{admin.email}</p>
                        <div className={`flex items-center gap-4 ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
                          <div className="flex items-center gap-1">
                            <Calendar className={`${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} />
                            Joined {formatDate(admin.createdAt)}
                          </div>
                          {admin.lastLogin && (
                            <div className="flex items-center gap-1">
                              <Clock className={`${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} />
                              Last {formatDate(admin.lastLogin)}
                            </div>
                          )}
                        </div>
                        {isMobile && (
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-xs font-medium">
                                {getPermissionCount(admin.permissions)} permissions
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {admin.role === 'super_admin' ? 'Full access' : 'Limited access'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`${isMobile ? 'flex justify-end' : 'flex items-center gap-3'}`}>
                      {!isMobile && (
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {getPermissionCount(admin.permissions)} permissions
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {admin.role === 'super_admin' ? 'Full access' : 'Limited access'}
                          </p>
                        </div>
                      )}
                      
                      <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
                        {admin.role !== 'super_admin' && (
                          <>
                            <Button
                              size={isMobile ? "sm" : "sm"}
                              variant="outline"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                if (onEditAdmin) onEditAdmin();
                              }}
                              disabled={isLoading}
                              className={isMobile ? 'px-2' : ''}
                            >
                              <Edit className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
                              {!isMobile && 'Edit Profile'}
                            </Button>
                            <Button
                              size={isMobile ? "sm" : "sm"}
                              variant="outline"
                              onClick={() => handleEditPermissions(admin)}
                              disabled={isLoading}
                              className={isMobile ? 'px-2' : ''}
                            >
                              <Shield className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
                              {!isMobile && 'Permissions'}
                            </Button>
                            <Button
                              size={isMobile ? "sm" : "sm"}
                              variant="outline"
                              onClick={() => {
                                setAdminToDelete(admin);
                                setDeleteDialogOpen(true);
                              }}
                              disabled={isLoading}
                              className={`text-destructive hover:text-destructive ${isMobile ? 'px-2' : ''}`}
                            >
                              <Trash2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < admins.length - 1 && <Separator className="my-4" />}
                </div>
              ))}

              {admins.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No administrators found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get started by creating your first admin account
                  </p>
                  <Button onClick={onCreateNewAdmin}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create New Admin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Permissions Dialog */}
      <Dialog 
        open={!!localSelectedAdmin} 
        onOpenChange={(open) => {
          if (!open) {
            setLocalSelectedAdmin(null);
            setEditingPermissions(null);
            setError('');
          }
        }}
      >
        <DialogContent className={`${isMobile ? 'mx-4 max-w-sm' : 'max-w-2xl'}`}>
          <DialogHeader>
            <DialogTitle className={`${isMobile ? 'text-base' : ''}`}>Edit Admin Permissions</DialogTitle>
            <DialogDescription className={`${isMobile ? 'text-xs' : ''}`}>
              Configure dashboard access permissions for {localSelectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editingPermissions && (
            <div className={`space-y-${isMobile ? '4' : '6'}`}>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                {Object.entries(permissionLabels).map(([key, label]) => {
                  const permissionKey = key as keyof AdminPermissions;
                  // Skip user management for regular admins
                  if (permissionKey === 'userManagement') return null;
                  
                  return (
                    <div key={permissionKey} className="flex items-center space-x-3">
                      <Checkbox
                        id={permissionKey}
                        checked={editingPermissions[permissionKey]}
                        onCheckedChange={(checked) => handlePermissionChange(permissionKey, !!checked)}
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor={permissionKey}
                        className={`font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${isMobile ? 'text-sm' : ''}`}
                      >
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className={`${isMobile ? 'flex-col space-y-2' : ''}`}>
            <Button
              variant="outline"
              onClick={() => {
                setLocalSelectedAdmin(null);
                setEditingPermissions(null);
                setError('');
              }}
              disabled={isLoading}
              className={`${isMobile ? 'w-full' : ''}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePermissions}
              disabled={isLoading}
              className={`bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 ${isMobile ? 'w-full' : ''}`}
            >
              {isLoading ? "Saving..." : "Save Permissions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className={`${isMobile ? 'mx-4 max-w-sm' : ''}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 text-destructive ${isMobile ? 'text-base' : ''}`}>
              <AlertTriangle className="h-5 w-5" />
              Delete Admin Account
            </DialogTitle>
            <DialogDescription className={`${isMobile ? 'text-xs' : ''}`}>
              This action cannot be undone. This will permanently delete the admin account for{' '}
              <strong>{adminToDelete?.name}</strong> and remove all their access permissions.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className={`${isMobile ? 'flex-col space-y-2' : ''}`}>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAdminToDelete(null);
                setError('');
              }}
              disabled={isLoading}
              className={`${isMobile ? 'w-full' : ''}`}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAdmin}
              disabled={isLoading}
              className={`${isMobile ? 'w-full' : ''}`}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}