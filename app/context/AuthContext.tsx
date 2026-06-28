'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  pidUser: string;
  userEmail: string;
  userFirstname?: string;
  userLastname?: string;
  userPhone?: string;
  phone?: string;
  email?: string;
  name?: string;
  userImage: string;
  userStatus: string;
}

export type RegisterStoreResponse = {
  statusx: 'SUCCESS' | 'FAILED_VALIDATION' | 'FAILED';
  message: string;
};

interface AuthContextType {
  user: User | null;
  login: (
    userEmail: string,
    userPassword: string,
    recaptchaToken?: string,
  ) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    userEmail: string,
    userPassword: string,
    userFirstname?: string,
  ) => Promise<void>;
  register_store: (
    userFirstname?: string,
    userLastname?: string,
    userEmail?: string,
    userPhone?: string,
    userPassword?: string,
    confirmPassword?: string,
    userAffiliateRef?: string,
  ) => Promise<RegisterStoreResponse>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_LOGIN_REDIRECT = '/dashboard/procurement';

function getSafeLoginRedirect(redirectCandidate: string): string {
  if (!redirectCandidate) return DEFAULT_LOGIN_REDIRECT;
  if (
    !redirectCandidate.startsWith('/') ||
    redirectCandidate.startsWith('//') ||
    redirectCandidate.startsWith('/auth/')
  ) {
    return DEFAULT_LOGIN_REDIRECT;
  }

  try {
    const [pathWithQuery, hash = ''] = redirectCandidate.split('#');
    const [pathname, search = ''] = pathWithQuery.split('?');
    const searchParams = new URLSearchParams(search);
    const isDashboardPath = pathname.startsWith('/dashboard');
    const isShopCheckoutResume =
      pathname === '/shop/checkout' &&
      searchParams.get('resumeCheckout') === '1';

    const isIntelligencePath = pathname.startsWith('/intelligence');

    if (isDashboardPath || isShopCheckoutResume || isIntelligencePath) {
      return `${pathname}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
    }
  } catch {
    return DEFAULT_LOGIN_REDIRECT;
  }

  return DEFAULT_LOGIN_REDIRECT;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const POST_LOGOUT_REDIRECT_KEY = 'sureimports:postLogoutRedirect';

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
    const shouldHydrateAuth =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/intelligence') ||
      pathname.startsWith('/auth') ||
      pathname === '/login' ||
      pathname.startsWith('/shop/checkout');

    if (!shouldHydrateAuth) {
      setUser(null);
      return;
    }

    checkAuth();
  }, [pathname]);

  //////////////////////////////////// LOGIN
  const login = async (
    userEmail: string,
    userPassword: string,
    recaptchaToken?: string,
  ) => {
    const searchParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const nextParam = searchParams?.get('next') || '';
    const storedNextPath =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(POST_LOGOUT_REDIRECT_KEY) || ''
        : '';
    const redirectCandidate = nextParam || storedNextPath;
    const safeNextPath = getSafeLoginRedirect(redirectCandidate);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, userPassword, recaptchaToken }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);

      if (data.statusx === 'MIGRATION_REQUIRED' || data.statusx === 'RESET') {
        router.push('/auth/welcome-reset-password?email=' + userEmail);
      } else if (data.statusx === 'NOT_VERIFIED') {
        router.push('/auth/account-not-activated/?email=' + userEmail);
      } else if (data.statusx == 'USER_DOES_NOT_EXIST') {
        throw new Error(data.message);
      } else if (data.statusx == 'SUCCESS') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(POST_LOGOUT_REDIRECT_KEY);
        }
        router.push(safeNextPath);
      } else {
        throw new Error(data.message);
      }
    } else {
      throw new Error(data.message);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    const searchParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const nextParam = searchParams?.get('next') || '';
    const storedNextPath =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(POST_LOGOUT_REDIRECT_KEY) || ''
        : '';
    const redirectCandidate = nextParam || storedNextPath;
    const safeNextPath = getSafeLoginRedirect(redirectCandidate);

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();

    if (!res.ok || data.statusx !== 'SUCCESS') {
      throw new Error(data.message || 'Google sign-in failed.');
    }

    setUser(data.user);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(POST_LOGOUT_REDIRECT_KEY);
    }
    router.push(safeNextPath);
  };

  /////////////////////////////////// LOGOUT
  const logout = async () => {
    const currentPath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}`
        : '';
    const safeCurrentPath = getSafeLoginRedirect(currentPath);

    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(POST_LOGOUT_REDIRECT_KEY, safeCurrentPath);
    }
    router.push(`/auth/login?next=${encodeURIComponent(safeCurrentPath)}`);
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

  /////////////////////////////////// REGISTRATION STORE
  const register_store = async (
    userFirstname?: string,
    userLastname?: string,
    userEmail?: string,
    userPhone?: string,
    userPassword?: string,
    confirmPassword?: string,
    userAffiliateRef?: string,
  ) => {
    const res = await fetch('/api/auth/register-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userFirstname,
        userLastname,
        userEmail,
        userPhone,
        userPassword,
        confirmPassword,
        userAffiliateRef,
      }),
    });

    const data = (await res.json()) as RegisterStoreResponse;

    if (res.ok) {
      //setUser(data.user);
      //router.push('/dashboard');
      if (data.statusx === 'SUCCESS') {
        //router.push('/auth/account-creation-success');
        return data;
      } else if (data.statusx === 'FAILED_VALIDATION') {
        //router.push('/auth/signup');
        return data;
      } else if (data.statusx == 'FAILED') {
        throw new Error(data.message);
      }
      throw new Error(data.message || 'Registration failed.');
    } else {
      throw new Error(data.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        register,
        register_store,
        checkAuth,
      }}
    >
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
