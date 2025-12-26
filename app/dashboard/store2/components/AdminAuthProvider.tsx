'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface AdminPermissions {
  overview: boolean;
  products: boolean;
  orders: boolean;
  customers: boolean;
  reports: boolean;
  bulkOrders: boolean;
  returns: boolean;
  userManagement: boolean; // Only for super admin
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  permissions: AdminPermissions;
  createdAt: string;
  lastLogin?: string;
}

interface AdminAuthContextType {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  admins: AdminUser[];
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  createAdmin: (
    adminData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  updateAdminPermissions: (
    adminId: string,
    permissions: AdminPermissions,
  ) => Promise<{ success: boolean; error?: string }>;
  updateAdminProfile: (
    adminId: string,
    updateData: { name?: string; email?: string; password?: string },
  ) => Promise<{ success: boolean; error?: string }>;
  deleteAdmin: (
    adminId: string,
  ) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  setSelectedAdmin: (admin: AdminUser | null) => void;
  getSelectedAdmin: () => AdminUser | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

// Default super admin with full permissions
const DEFAULT_SUPER_ADMIN: AdminUser = {
  id: 'super_admin_001',
  email: 'superadmin@buygadgets.com',
  name: 'Super Administrator',
  role: 'super_admin',
  permissions: {
    overview: true,
    products: true,
    orders: true,
    customers: true,
    reports: true,
    bulkOrders: true,
    returns: true,
    userManagement: true,
  },
  createdAt: '2025-01-01T00:00:00.000Z',
};

// Password for super admin: "SuperAdmin2025!"
const DEFAULT_PASSWORDS: Record<string, string> = {
  'superadmin@buygadgets.com': 'SuperAdmin2025!',
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [passwords, setPasswords] =
    useState<Record<string, string>>(DEFAULT_PASSWORDS);
  const [selectedAdmin, setSelectedAdminState] = useState<AdminUser | null>(
    null,
  );

  // Initialize admin data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load admins
      const savedAdmins = localStorage.getItem('adminUsers');
      if (savedAdmins) {
        try {
          const parsedAdmins = JSON.parse(savedAdmins);
          setAdmins(parsedAdmins);
        } catch {
          setAdmins([DEFAULT_SUPER_ADMIN]);
        }
      } else {
        setAdmins([DEFAULT_SUPER_ADMIN]);
      }

      // Load passwords
      const savedPasswords = localStorage.getItem('adminPasswords');
      if (savedPasswords) {
        try {
          const parsedPasswords = JSON.parse(savedPasswords);
          setPasswords({ ...DEFAULT_PASSWORDS, ...parsedPasswords });
        } catch {
          setPasswords(DEFAULT_PASSWORDS);
        }
      }

      // Load current admin session
      const savedSession = localStorage.getItem('currentAdminSession');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          // Verify session is still valid (less than 24 hours old)
          const sessionTime = new Date(session.timestamp).getTime();
          const currentTime = new Date().getTime();
          if (currentTime - sessionTime < 24 * 60 * 60 * 1000) {
            setCurrentAdmin(session.admin);
          } else {
            localStorage.removeItem('currentAdminSession');
          }
        } catch {
          localStorage.removeItem('currentAdminSession');
        }
      }
    }
  }, []);

  // Save admins to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && admins.length > 0) {
      localStorage.setItem('adminUsers', JSON.stringify(admins));
    }
  }, [admins]);

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminPasswords', JSON.stringify(passwords));
    }
  }, [passwords]);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const admin = admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );

    if (!admin) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (passwords[admin.email] !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    const updatedAdmin = { ...admin, lastLogin: new Date().toISOString() };
    setCurrentAdmin(updatedAdmin);

    // Update admin in the list
    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? updatedAdmin : a)),
    );

    // Save session
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'currentAdminSession',
        JSON.stringify({
          admin: updatedAdmin,
          timestamp: new Date().toISOString(),
        }),
      );
    }

    return { success: true };
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; error?: string }> => {
    // Check if admin already exists
    if (admins.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        error: 'An admin with this email already exists',
      };
    }

    // Only super admin can create new admins
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return {
        success: false,
        error: 'Only super administrators can create new admin accounts',
      };
    }

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}`,
      email: email.toLowerCase(),
      name,
      role: 'admin',
      permissions: {
        overview: false,
        products: false,
        orders: false,
        customers: false,
        reports: false,
        bulkOrders: false,
        returns: false,
        userManagement: false,
      },
      createdAt: new Date().toISOString(),
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setPasswords((prev) => ({ ...prev, [email.toLowerCase()]: password }));

    return { success: true };
  };

  const signOut = () => {
    setCurrentAdmin(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentAdminSession');
    }
  };

  const resetPassword = async (
    email: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const admin = admins.find(
      (a) => a.email.toLowerCase() === email.toLowerCase(),
    );

    if (!admin) {
      return {
        success: false,
        error: 'No admin found with this email address',
      };
    }

    // In a real app, this would send an email. For now, we'll generate a temporary password
    const tempPassword = `TempPass${Date.now()}`;
    setPasswords((prev) => ({ ...prev, [admin.email]: tempPassword }));

    // In a real app, you'd send this via email
    alert(
      `Password reset successful! Your temporary password is: ${tempPassword}\n\nPlease change it after logging in.`,
    );

    return { success: true };
  };

  const createAdmin = async (
    adminData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return {
        success: false,
        error: 'Only super administrators can create admin accounts',
      };
    }

    if (
      admins.find(
        (a) => a.email.toLowerCase() === adminData.email.toLowerCase(),
      )
    ) {
      return {
        success: false,
        error: 'An admin with this email already exists',
      };
    }

    const newAdmin: AdminUser = {
      ...adminData,
      id: `admin_${Date.now()}`,
      email: adminData.email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setPasswords((prev) => ({ ...prev, [newAdmin.email]: password }));

    return { success: true };
  };

  const updateAdminPermissions = async (
    adminId: string,
    permissions: AdminPermissions,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return {
        success: false,
        error: 'Only super administrators can update permissions',
      };
    }

    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminId ? { ...admin, permissions } : admin,
      ),
    );

    return { success: true };
  };

  const updateAdminProfile = async (
    adminId: string,
    updateData: { name?: string; email?: string; password?: string },
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return {
        success: false,
        error: 'Only super administrators can update admin profiles',
      };
    }

    const adminToUpdate = admins.find((a) => a.id === adminId);
    if (!adminToUpdate) {
      return { success: false, error: 'Admin not found' };
    }

    if (adminToUpdate.role === 'super_admin' && currentAdmin.id !== adminId) {
      return {
        success: false,
        error: 'Cannot edit another super administrator',
      };
    }

    // Check if email already exists (if email is being changed)
    if (updateData.email && updateData.email !== adminToUpdate.email) {
      if (
        admins.find(
          (a) =>
            a.email.toLowerCase() === updateData.email.toLowerCase() &&
            a.id !== adminId,
        )
      ) {
        return {
          success: false,
          error: 'An admin with this email already exists',
        };
      }
    }

    // Update admin data
    setAdmins((prev) =>
      prev.map((admin) => {
        if (admin.id === adminId) {
          const updatedAdmin = { ...admin };
          if (updateData.name) updatedAdmin.name = updateData.name;
          if (updateData.email)
            updatedAdmin.email = updateData.email.toLowerCase();
          return updatedAdmin;
        }
        return admin;
      }),
    );

    // Update password if provided
    if (updateData.password) {
      const newEmail = updateData.email || adminToUpdate.email;
      setPasswords((prev) => {
        const newPasswords = { ...prev };
        // Remove old email password if email changed
        if (updateData.email && updateData.email !== adminToUpdate.email) {
          delete newPasswords[adminToUpdate.email];
        }
        newPasswords[newEmail.toLowerCase()] = updateData.password!;
        return newPasswords;
      });
    } else if (updateData.email && updateData.email !== adminToUpdate.email) {
      // If only email changed, update password key
      setPasswords((prev) => {
        const newPasswords = { ...prev };
        newPasswords[updateData.email!.toLowerCase()] =
          prev[adminToUpdate.email];
        delete newPasswords[adminToUpdate.email];
        return newPasswords;
      });
    }

    return { success: true };
  };

  const deleteAdmin = async (
    adminId: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return {
        success: false,
        error: 'Only super administrators can delete admin accounts',
      };
    }

    const adminToDelete = admins.find((a) => a.id === adminId);
    if (!adminToDelete) {
      return { success: false, error: 'Admin not found' };
    }

    if (adminToDelete.role === 'super_admin') {
      return {
        success: false,
        error: 'Cannot delete super administrator account',
      };
    }

    setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
    setPasswords((prev) => {
      const newPasswords = { ...prev };
      delete newPasswords[adminToDelete.email];
      return newPasswords;
    });

    return { success: true };
  };

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!currentAdmin) return false;
    return currentAdmin.permissions[permission];
  };

  const setSelectedAdmin = (admin: AdminUser | null) => {
    setSelectedAdminState(admin);
  };

  const getSelectedAdmin = () => {
    return selectedAdmin;
  };

  const value: AdminAuthContextType = {
    currentAdmin,
    isAuthenticated: !!currentAdmin,
    admins,
    signIn,
    signUp,
    signOut,
    resetPassword,
    createAdmin,
    updateAdminPermissions,
    updateAdminProfile,
    deleteAdmin,
    hasPermission,
    setSelectedAdmin,
    getSelectedAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
