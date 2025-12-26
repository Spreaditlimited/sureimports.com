import { useState } from 'react';

interface MobileBottomNavProps {
  cartItemCount: number;
  onShowCart: () => void;
  onShowOrders: () => void;
  onShowWallet: () => void;
  onShowStore: () => void;
  currentView: string;
}

export function MobileBottomNav({
  cartItemCount,
  onShowCart,
  onShowOrders,
  onShowWallet,
  onShowStore,
  currentView,
}: MobileBottomNavProps) {
  return (
    <div className="safe-area-pb fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white px-2 py-1 dark:bg-card md:hidden">
      <div className="flex items-center justify-around">
        {/* Store */}
        <button
          onClick={onShowStore}
          className={`flex flex-col items-center justify-center rounded-lg p-3 transition-colors ${
            currentView === 'store'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <div className="mb-1 h-6 w-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Store</span>
        </button>

        {/* Cart */}
        <button
          onClick={onShowCart}
          className={`relative flex flex-col items-center justify-center rounded-lg p-3 transition-colors ${
            currentView === 'cart'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <div className="mb-1 h-6 w-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {cartItemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white shadow-lg">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
          <span className="text-xs font-medium">Cart</span>
        </button>

        {/* Orders */}
        <button
          onClick={onShowOrders}
          className={`flex flex-col items-center justify-center rounded-lg p-3 transition-colors ${
            currentView === 'orders'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <div className="mb-1 h-6 w-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 13H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Orders</span>
        </button>

        {/* Wallet */}
        <button
          onClick={onShowWallet}
          className={`flex flex-col items-center justify-center rounded-lg p-3 transition-colors ${
            currentView === 'wallet'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
        >
          <div className="mb-1 h-6 w-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H18C16.8954 12 16 11.1046 16 10V10C16 8.89543 16.8954 8 18 8H21V12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xs font-medium">Wallet</span>
        </button>
      </div>
    </div>
  );
}
