'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { toast } from 'sonner';

// Types
export interface CartItem {
  pidProduct: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand?: string;
  productCategory?: string;
  quantity: number;
  maxQuantity?: number;
}

export interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (pidProduct: string) => void;
  updateQuantity: (pidProduct: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (pidProduct: string) => boolean;
  getCartItem: (pidProduct: string) => CartItem | undefined;
}

const ShopCartContext = createContext<CartContextType | undefined>(undefined);

export function ShopCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const toastShownRef = React.useRef<Set<string>>(new Set());

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('shopCart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Helper function to show toast only once
  const showToast = (type: 'success' | 'error', message: string) => {
    const toastKey = `${type}-${message}-${Date.now()}`;

    // Prevent duplicate toasts within 100ms
    if (!toastShownRef.current.has(message)) {
      toastShownRef.current.add(message);

      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }

      // Clear the toast key after 100ms to allow future toasts with same message
      setTimeout(() => {
        toastShownRef.current.delete(message);
      }, 100);
    }
  };

  // Calculate cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0,
  );

  // Add item to cart
  const addToCart = (
    item: Omit<CartItem, 'quantity'>,
    quantity: number = 1,
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (i) => i.pidProduct === item.pidProduct,
      );

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        const maxQty = item.maxQuantity || 999;

        if (newQuantity > maxQty) {
          showToast('error', `Maximum quantity for this item is ${maxQty}`);
          return prevCart;
        }

        showToast('success', `Updated quantity for ${item.productName}`);
        return prevCart.map((i) =>
          i.pidProduct === item.pidProduct
            ? { ...i, quantity: newQuantity }
            : i,
        );
      } else {
        // Add new item
        showToast('success', `${item.productName} added to cart`);
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (pidProduct: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.pidProduct === pidProduct);
      if (item) {
        showToast('success', `${item.productName} removed from cart`);
      }
      return prevCart.filter((i) => i.pidProduct !== pidProduct);
    });
  };

  // Update item quantity
  const updateQuantity = (pidProduct: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pidProduct);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.pidProduct === pidProduct) {
          const maxQty = item.maxQuantity || 999;
          if (quantity > maxQty) {
            showToast('error', `Maximum quantity for this item is ${maxQty}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      }),
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    showToast('success', 'Cart cleared');
  };

  // Check if item is in cart
  const isInCart = (pidProduct: string): boolean => {
    return cart.some((item) => item.pidProduct === pidProduct);
  };

  // Get specific cart item
  const getCartItem = (pidProduct: string): CartItem | undefined => {
    return cart.find((item) => item.pidProduct === pidProduct);
  };

  const value: CartContextType = {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  };

  return (
    <ShopCartContext.Provider value={value}>
      {children}
    </ShopCartContext.Provider>
  );
}

export function useShopCart() {
  const context = useContext(ShopCartContext);
  if (context === undefined) {
    throw new Error('useShopCart must be used within a ShopCartProvider');
  }
  return context;
}
