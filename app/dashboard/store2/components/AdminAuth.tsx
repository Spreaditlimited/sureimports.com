"use client";

import { useState } from 'react';
import { AdminSignIn } from './AdminSignIn';
import { AdminSignUp } from './AdminSignUp';
import { AdminResetPassword } from './AdminResetPassword';
import { AdminDashboard } from './AdminDashboard';
import { AdminUserManagement } from './AdminUserManagement';
import { useAdminAuth } from './AdminAuthProvider';
import { Product, Order, OrderTab, BulkOrder } from '../App';

type AdminAuthView = 'signIn' | 'signUp' | 'resetPassword' | 'dashboard' | 'userManagement';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: string;
  description: string;
  date: string;
  orderNumber?: string;
}

interface AdminAuthProps {
  products: Product[];
  orders: Record<OrderTab, Order[]>;
  onProductUpdate: (products: Product[]) => void;
  onOrderStatusUpdate: (orderId: string, newStatus: Order['status'], tab: OrderTab) => void;
  onBackToStore: () => void;
  onBulkBuyer: () => void;
  onBulkOrderCreate: (bulkOrder: BulkOrder) => void;
  onReturnsOrderCreate: (returnsOrder: any) => void;
  walletBalance: number;
  transactions: Transaction[];
  onShowManageAdmins?: () => void;
}

export function AdminAuth({
  products,
  orders,
  onProductUpdate,
  onOrderStatusUpdate,
  onBackToStore,
  onBulkBuyer,
  onBulkOrderCreate,
  onReturnsOrderCreate,
  walletBalance,
  transactions,
  onShowManageAdmins
}: AdminAuthProps) {
  const { isAuthenticated, hasPermission } = useAdminAuth();
  const [currentView, setCurrentView] = useState<AdminAuthView>('signIn');

  const handleSignInSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleBackToSignIn = () => {
    setCurrentView('signIn');
  };

  const handleShowSignUp = () => {
    setCurrentView('signUp');
  };

  const handleShowResetPassword = () => {
    setCurrentView('resetPassword');
  };

  const handleResetSuccess = () => {
    setCurrentView('signIn');
  };

  const handleSignUpSuccess = () => {
    setCurrentView('signIn');
  };

  const handleShowUserManagement = () => {
    setCurrentView('userManagement');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleCreateNewAdmin = () => {
    setCurrentView('signUp');
  };

  // If not authenticated, show authentication forms
  if (!isAuthenticated) {
    switch (currentView) {
      case 'signUp':
        return (
          <AdminSignUp
            onSignUpSuccess={handleSignUpSuccess}
            onBackToSignIn={handleBackToSignIn}
          />
        );
      case 'resetPassword':
        return (
          <AdminResetPassword
            onResetSuccess={handleResetSuccess}
            onBackToSignIn={handleBackToSignIn}
          />
        );
      default:
        return (
          <AdminSignIn
            onSignInSuccess={handleSignInSuccess}
            onBackToStore={onBackToStore}
            onShowSignUp={handleShowSignUp}
            onShowResetPassword={handleShowResetPassword}
          />
        );
    }
  }

  // If authenticated, show admin content based on current view
  switch (currentView) {
    case 'userManagement':
      if (!hasPermission('userManagement')) {
        setCurrentView('dashboard');
        return null;
      }
      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto p-6">
            <AdminUserManagement onCreateNewAdmin={handleCreateNewAdmin} />
            <div className="mt-6">
              <button
                onClick={handleBackToDashboard}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    case 'signUp':
      return (
        <AdminSignUp
          onSignUpSuccess={() => setCurrentView('userManagement')}
          onBackToSignIn={handleBackToDashboard}
        />
      );
    default:
      return (
        <AdminDashboard
          products={products}
          orders={orders}
          onProductUpdate={onProductUpdate}
          onOrderStatusUpdate={onOrderStatusUpdate}
          onBackToStore={onBackToStore}
          onBulkBuyer={onBulkBuyer}
          onBulkOrderCreate={onBulkOrderCreate}
          onReturnsOrderCreate={onReturnsOrderCreate}
          walletBalance={walletBalance}
          transactions={transactions}
          onShowUserManagement={onShowManageAdmins || handleShowUserManagement}
          hasPermission={hasPermission}
        />
      );
  }
}