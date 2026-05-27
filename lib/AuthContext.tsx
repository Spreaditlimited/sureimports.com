'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  pidUser: string;
  userEmail: string;
  userFirstname?: string;
  userLastname?: string;
  phone?: string;
  email?: string;
  name?: string;
  userImage: string;
  userStatus: string;
}

interface AuthContextType {
  user: User | null;
  login: (userEmail: string, userPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    userEmail: string,
    userPassword: string,
    userFirstname?: string,
  ) => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  //////////////////////////////////// CHECK AUTH
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!res.ok) {
        setUser(null);
        return false;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
      return false;
    }
  };

  //////////////////////////////////// RUN AUTH-CHECK
  useEffect(() => {
    checkAuth();
  }, []); //This was the line that needed to be updated to include the dependency

  //////////////////////////////////// LOGIN
  const login = async (userEmail: string, userPassword: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, userPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);

      if (data.statusx === 'RESET') {
        router.push('/auth/welcome-reset-password?email=' + userEmail);
      } else if (data.statusx === 'NOT_VERIFIED') {
        router.push('/auth/account-not-activated/?email=' + userEmail);
      } else if (data.statusx == 'USER_DOES_NOT_EXIST') {
        throw new Error(data.message);
      } else if (data.statusx == 'SUCCESS') {
        router.push('/dashboard/store?id=laptop');
      } else {
        throw new Error(data.message);
      }
    } else {
      throw new Error(data.message);
    }
  };

  /////////////////////////////////// LOGOUT
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/auth/login');
  };

  /////////////////////////////////// REGISTRATION
  const register = async (
    userEmail: string,
    userPassword: string,
    userFirstname?: string,
  ) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, userPassword, userFirstname }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      router.push('/dashboard');
    } else {
      throw new Error(data.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
