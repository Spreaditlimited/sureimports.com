'use client';

import { useState, useEffect, useMemo } from 'react';
import mobilesvgPaths from './imports/svg-oml3ehjwbt';
import imgImage6 from 'figma:asset/d451874bc33ab5b54b759f9fdbdbe1e6ff9d282e8.png';
import imgImage8 from 'figma:asset/41aa4a18cc975e63c67376fe9868633d944b75fc.png';
import imgImage9 from 'figma:asset/f9d06ddaf3b37fd3dba092847c08993cab4d91b4.png';
import imgImage11 from 'figma:asset/51ee115e33ab5b54b759f9fdbdbe1e6ff9d282e8.png';
import imgImage12 from 'figma:asset/1639ef9435c75fab85195ca7ec84d9925a5da4d5.png';
import imgImage13 from 'figma:asset/9624e54c7174fd81a33c10142056073f6d62d55d.png';
import imgImage14 from 'figma:asset/159cbfce8569e9bf900f9841143887317bf0442e.png';
import imgImage15 from 'figma:asset/2c2dccece0893759d6c6a3ec9ad721cc2dd9d452.png';
import imgSureimportsReverse from 'figma:asset/84c7e5da1d268b600da8ab16cf73ccc4cef6b5ac.png';

import { ProductCard } from './components/ProductCard';
import { SearchFilter } from './components/SearchFilter';
import { MobileProductCard } from './components/MobileProductCard';
import { MobileSearchFilter } from './components/MobileSearchFilter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PaginationControls } from './components/PaginationControls';
import FilterPanel from './components/FilterPanel';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import BulkBuyerDialog from './components/BulkBuyerDialog';
import MyOrders from './components/MyOrders';
import Wallet from './components/Wallet';
import { AdminAuth } from './components/AdminAuth';
import { AdminAuthProvider } from './components/AdminAuthProvider';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminSignUp } from './components/AdminSignUp';
import { AdminEditProfile } from './components/AdminEditProfile';
import { ThemeProvider } from './components/ThemeProvider';
import { SafeThemeToggle } from './components/ThemeToggle';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { MobileHeader } from './components/MobileHeader';

export interface FilterState {
  category: string;
  brand: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedConditions: string[];
  selectedStorage: string[];
  selectedMemory: string[];
  hasGraphicsCard: string; // "Yes", "No", or ""
  selectedGraphicsMemory: string[];
  selectedWarranty: string[];
}

// Dynamic category data that gets updated from admin settings
export const getCategoryData = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('storeSettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        const categoryData: Record<string, string[]> = { All: ['All'] };

        Object.entries(settings.categories).forEach(([category, brands]) => {
          categoryData[category] = ['All', ...(brands as string[])];
        });

        return categoryData;
      } catch {
        // If parsing fails, return default
      }
    }
  }

  // Default fallback
  return {
    All: ['All'],
    Laptops: ['All', 'HP', 'Macbooks', 'ASUS', 'Lenovo'],
    Phones: ['All', 'Apple', 'Samsung', 'Google Pixel', 'Redmi'],
    Tablets: ['All', 'Apple', 'Samsung'],
    Accessories: ['All', 'FAYA'],
  };
};

export const categoryData = getCategoryData();

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string; // This is now the store price (supplier price * 225)
  supplierPrice: number; // Price in Chinese RMB
  affiliateCommission: number; // Commission in Naira
  rating: number;
  brand: string;
  category: string;
  condition: string;
  image: string;
  storage?: string;
  memory?: string;
  hasGraphicsCard?: boolean;
  graphicsMemory?: string;
  warranty?: string;
  features?: string; // Product features text area
  paySmallSmall?: string; // Pay Small Small text area
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderTab = 'upcoming' | 'previous' | 'returned' | 'cancelled';

export interface Order {
  id: string;
  number: string;
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  price: string;
  status:
    | 'confirmed'
    | 'shipped'
    | 'arrived'
    | 'replaced'
    | 'shipped-back'
    | 'arrived-back'
    | 'delivered'
    | 'cancelled';
  progress: number; // 0-100
  orderDate: string;
  expectedDelivery: string;
  isBulkOrder?: boolean;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  affiliateCommission?: number;
}

export interface BulkOrderItem {
  productId: number;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  affiliateCommission: number;
}

export interface BulkOrder {
  id: string;
  orderNumber: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: BulkOrderItem[];
  totalAmount: number;
  totalCommission: number;
  status: 'confirmed' | 'shipped' | 'arrived' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery: string;
  notes?: string;
}

const allProducts: Product[] = [
  // Laptops - HP
  {
    id: 1,
    title: 'HP EliteBook x360 1040 G8 – Power...',
    description:
      'Experience elite performance in a sleek, convertible design with the HP EliteBook x360 1040 G8. Built...',
    price: '₦967,500.00',
    supplierPrice: 3550, // (967500 ÷ 225) - 750 = 3550 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'HP',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage6,
    storage: '512G',
    memory: '16G',
    hasGraphicsCard: true,
    graphicsMemory: '4G',
    warranty: '12 months',
  },
  {
    id: 2,
    title: 'HP Elite x2 G8 – Core i7 Power Meet....',
    description:
      'The HP Elite x2 G8 is a premium split (2-in-1) computer, blending the power of a laptop with...',
    price: '₦922,500.00',
    supplierPrice: 3350, // (922500 ÷ 225) - 750 = 3350 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'HP',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage8,
  },
  {
    id: 3,
    title: 'HP Elite x2 Split Computer (8th Gen...',
    description:
      'The HP Elite x2 Split Computer combines the power of a laptop with the versatibility of a tablet....',
    price: '₦596,250.00',
    supplierPrice: 1900, // (596250 ÷ 225) - 750 = 1900 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'HP',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage9,
  },
  // Laptops - Apple (Macbooks)
  {
    id: 4,
    title: 'MacBook Air 13.6" M3 Chip 8GB 512GB..',
    description:
      'A top-tier device for serious users. With 512GB SSD and the powerful M3 chip, this MacBook Air is ...',
    price: '₦1,260,000.00',
    supplierPrice: 4850, // (1260000 ÷ 225) - 750 = 4850 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'Macbooks',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage11,
    storage: '512G',
    memory: '8G',
    hasGraphicsCard: false,
    warranty: '3 months',
  },
  {
    id: 5,
    title: 'MacBook Air 13.6" M3 Chip 8GB 256GB..',
    description:
      "The 2024 MacBook Air M3 combines the latest Apple Silicon with minimalist design. It's optimized...",
    price: '₦1,147,500.00',
    supplierPrice: 4350, // (1147500 ÷ 225) - 750 = 4350 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'Macbooks',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage12,
  },
  {
    id: 6,
    title: 'MacBook Air 13.6" M2 Chip 8GB 512GB..',
    description:
      'For professionals who need more space, this MacBook Air M2 comes with 512GB of blazing-fast...',
    price: '₦1,147,500.00',
    supplierPrice: 4350, // (1147500 ÷ 225) - 750 = 4350 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'Macbooks',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage13,
  },
  {
    id: 7,
    title: 'MacBook Air 13.6" M2 Chip 8GB 256GB..',
    description:
      'The redesigned MacBook Air M2 features a larger 13.6" Liquid Retina display, a razor-thin profile, and...',
    price: '₦1,035,001.00',
    supplierPrice: 3850, // (1035001 ÷ 225) - 750 = 3850 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'Macbooks',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage14,
  },
  {
    id: 8,
    title: 'MacBook Air 13.3" M1 Chip 8GB 512GB...',
    description:
      'Enjoy all the performance of the M1 chip with twice the storage. Perfect for users who work with large...',
    price: '₦877,500.00',
    supplierPrice: 3150, // (877500 ÷ 225) - 750 = 3150 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for laptops
    rating: 5,
    brand: 'Macbooks',
    category: 'Laptops',
    condition: 'Pre-owned',
    image: imgImage15,
  },
  // Phones - Apple
  {
    id: 9,
    title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    description:
      'The ultimate iPhone experience with titanium design, A17 Pro chip, and advanced camera system...',
    price: '₦1,850,000.00',
    supplierPrice: 7722, // (1850000 ÷ 225) - 500 = 7722 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for phones
    rating: 5,
    brand: 'Apple',
    category: 'Phones',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&crop=center',
    storage: '256G',
    memory: '8G',
    hasGraphicsCard: false,
    warranty: '12 months',
  },
  {
    id: 10,
    title: 'iPhone 14 128GB - Midnight',
    description:
      'Powerful A15 Bionic chip, advanced dual-camera system, and all-day battery life in a sleek design...',
    price: '₦1,200,000.00',
    supplierPrice: 4833, // (1200000 ÷ 225) - 500 = 4833 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for phones
    rating: 5,
    brand: 'Apple',
    category: 'Phones',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
  },
  // Phones - Samsung
  {
    id: 11,
    title: 'Samsung Galaxy S24 Ultra 512GB',
    description:
      'Ultimate Android flagship with S Pen, powerful cameras, and AI-enhanced features for productivity...',
    price: '₦1,650,000.00',
    supplierPrice: 6833, // (1650000 ÷ 225) - 500 = 6833 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for phones
    rating: 5,
    brand: 'Samsung',
    category: 'Phones',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center',
  },
  {
    id: 12,
    title: 'Samsung Galaxy A54 5G 128GB',
    description:
      'Mid-range excellence with premium features, excellent camera, and fast 5G connectivity...',
    price: '₦485,000.00',
    supplierPrice: 1656, // (485000 ÷ 225) - 500 = 1656 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for phones
    rating: 4,
    brand: 'Samsung',
    category: 'Phones',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
  },
  // Tablets - Apple
  {
    id: 13,
    title: 'iPad Pro 12.9" M2 Chip 256GB',
    description:
      'Professional tablet with M2 chip performance, stunning Liquid Retina XDR display, and Apple Pencil support...',
    price: '₦1,450,000.00',
    supplierPrice: 5944, // (1450000 ÷ 225) - 500 = 5944 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for tablets
    rating: 5,
    brand: 'Apple',
    category: 'Tablets',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
    storage: '256G',
    memory: '8G',
    hasGraphicsCard: false,
    warranty: '12 months',
  },
  {
    id: 14,
    title: 'iPad Air 10.9" 64GB Wi-Fi',
    description:
      'Versatile and powerful tablet perfect for creativity, productivity, and entertainment on the go...',
    price: '₦785,000.00',
    supplierPrice: 2989, // (785000 ÷ 225) - 500 = 2989 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for tablets
    rating: 5,
    brand: 'Apple',
    category: 'Tablets',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center',
  },
  // Tablets - Samsung
  {
    id: 15,
    title: 'Samsung Galaxy Tab S9 256GB',
    description:
      'Premium Android tablet with S Pen included, beautiful AMOLED display, and desktop-class performance...',
    price: '₦925,000.00',
    supplierPrice: 3611, // (925000 ÷ 225) - 500 = 3611 RMB
    affiliateCommission: 20000, // Fixed ₦20,000 for tablets
    rating: 5,
    brand: 'Samsung',
    category: 'Tablets',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop&crop=center',
  },
  // Accessories - FAYA
  {
    id: 16,
    title: 'FAYA Wireless Earbuds Pro',
    description:
      'Premium wireless earbuds with active noise cancellation, crystal clear sound, and all-day battery life...',
    price: '₦45,000.00',
    supplierPrice: 200, // 45000 ÷ 225 = 200 RMB (no addition for accessories)
    affiliateCommission: 1000, // Fixed ₦1,000 for FAYA accessories
    rating: 4,
    brand: 'FAYA',
    category: 'Accessories',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center',
    storage: '32G',
    memory: '2G',
    hasGraphicsCard: false,
    warranty: '3 months',
  },
  {
    id: 17,
    title: 'FAYA Fast Charging Power Bank 20000mAh',
    description:
      'High-capacity power bank with fast charging technology, multiple ports, and compact design for travel...',
    price: '₦35,000.00',
    supplierPrice: 156, // 35000 ÷ 225 = 156 RMB (no addition for accessories)
    affiliateCommission: 1000, // Fixed ₦1,000 for FAYA accessories
    rating: 5,
    brand: 'FAYA',
    category: 'Accessories',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1609592604820-7cfc30c3ae23?w=500&h=500&fit=crop&crop=center',
  },
  {
    id: 18,
    title: 'FAYA Bluetooth Speaker Pro',
    description:
      'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 24-hour battery life...',
    price: '₦55,000.00',
    supplierPrice: 244, // 55000 ÷ 225 = 244 RMB (no addition for accessories)
    affiliateCommission: 1000, // Fixed ₦1,000 for FAYA accessories
    rating: 4,
    brand: 'FAYA',
    category: 'Accessories',
    condition: 'Brand new',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center',
  },
];

const PRODUCTS_PER_PAGE = 16;

function AppContent() {
  const [isMobile, setIsMobile] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showBulkBuyerDialog, setShowBulkBuyerDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<
    | 'store'
    | 'product'
    | 'cart'
    | 'checkout'
    | 'orders'
    | 'wallet'
    | 'admin'
    | 'manage-admins'
    | 'create-admin'
    | 'edit-admin'
  >('store');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>(allProducts);

  // Initialize wallet state from localStorage with fallback defaults
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('walletBalance');
      return saved ? parseFloat(saved) : 125750;
    }
    return 125750;
  });

  const [pendingWithdrawal, setPendingWithdrawal] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingWithdrawal');
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });

  // Order state management with mock data
  const [orders, setOrders] = useState<Record<OrderTab, Order[]>>(() => ({
    upcoming: [
      {
        id: '1',
        number: '#1543',
        product: {
          name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
          image:
            'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 12,
        price: '₦22,200,000.00',
        status: 'confirmed',
        progress: 25,
        orderDate: '06 - 08 - 2025',
        expectedDelivery: '20 - 08 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Adebayo Johnson',
          email: 'adebayo.johnson@email.com',
          phone: '+234 802 123 4567',
          address: '123 Victoria Island, Lagos',
        },
        affiliateCommission: 60000,
      },
      {
        id: '2',
        number: '#1544',
        product: {
          name: 'iPad Pro 12.9" M2 Chip 256GB',
          image:
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 1,
        price: '₦1,450,000.00',
        status: 'shipped',
        progress: 50,
        orderDate: '05 - 08 - 2025',
        expectedDelivery: '19 - 08 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Funmi Okafor',
          email: 'funmi.okafor@techcorp.com',
          phone: '+234 803 987 6543',
          address: '45 Allen Avenue, Ikeja, Lagos',
        },
      },
      {
        id: '3',
        number: '#1545',
        product: {
          name: 'Samsung Galaxy S24 Ultra 512GB',
          image:
            'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 20,
        price: '₦33,000,000.00',
        status: 'confirmed',
        progress: 25,
        orderDate: '06 - 08 - 2025',
        expectedDelivery: '20 - 08 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Chioma Nnamani',
          email: 'chioma.nnamani@retailgroup.ng',
          phone: '+234 814 567 8901',
          address: '67 Opebi Road, Ikeja, Lagos',
        },
        affiliateCommission: 100000,
      },
      {
        id: '4',
        number: '#1546',
        product: {
          name: 'MacBook Air 13.6" M3 Chip 8GB 512GB',
          image: imgImage11,
        },
        quantity: 2,
        price: '₦2,520,000.00',
        status: 'arrived',
        progress: 75,
        orderDate: '03 - 08 - 2025',
        expectedDelivery: '17 - 08 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Kemi Adeleke',
          email: 'kemi@startuplab.ng',
          phone: '+234 901 234 5678',
          address: '12 Broad Street, Lagos Island',
        },
      },
      {
        id: '11',
        number: '#1547',
        product: {
          name: 'HP EliteBook x360 1040 G8',
          image: imgImage6,
        },
        quantity: 15,
        price: '₦14,512,500.00',
        status: 'confirmed',
        progress: 25,
        orderDate: '06 - 08 - 2025',
        expectedDelivery: '20 - 08 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Olumide Fashola',
          email: 'olumide@techsolutions.ng',
          phone: '+234 818 765 4321',
          address: '88 Admiralty Way, Lekki, Lagos',
        },
        affiliateCommission: 75000,
      },
    ],
    previous: [
      {
        id: '5',
        number: '#1540',
        product: {
          name: 'iPhone 14 128GB - Midnight',
          image:
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 1,
        price: '₦1,200,000.00',
        status: 'delivered',
        progress: 100,
        orderDate: '25 - 07 - 2025',
        expectedDelivery: '08 - 08 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Emeka Okafor',
          email: 'emeka@digitalhub.ng',
          phone: '+234 813 456 7890',
          address: '15 Adeola Odeku Street, VI, Lagos',
        },
      },
      {
        id: '6',
        number: '#1541',
        product: {
          name: 'Samsung Galaxy Tab S9 256GB',
          image:
            'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 30,
        price: '₦27,750,000.00',
        status: 'delivered',
        progress: 100,
        orderDate: '20 - 07 - 2025',
        expectedDelivery: '03 - 08 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Tunde Bakare',
          email: 'tunde.bakare@edutech.com',
          phone: '+234 805 555 7890',
          address: '78 Awolowo Road, Ikoyi, Lagos',
        },
        affiliateCommission: 150000,
      },
      {
        id: '7',
        number: '#1538',
        product: {
          name: 'MacBook Air 13.6" M2 Chip 8GB 256GB',
          image: imgImage14,
        },
        quantity: 22,
        price: '₦22,770,022.00',
        status: 'delivered',
        progress: 100,
        orderDate: '18 - 07 - 2025',
        expectedDelivery: '01 - 08 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Folake Adebayo',
          email: 'folake@corptech.ng',
          phone: '+234 806 234 5678',
          address: '29 Idowu Martins Street, VI, Lagos',
        },
        affiliateCommission: 110000,
      },
      {
        id: '12',
        number: '#1542',
        product: {
          name: 'Samsung Galaxy A54 5G 128GB',
          image:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 3,
        price: '₦1,455,000.00',
        status: 'delivered',
        progress: 100,
        orderDate: '22 - 07 - 2025',
        expectedDelivery: '05 - 08 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Ngozi Okafor',
          email: 'ngozi.okafor@fashion.ng',
          phone: '+234 817 543 2109',
          address: '22 Surulere Street, Lagos',
        },
      },
    ],
    returned: [
      {
        id: '8',
        number: '#1539',
        product: {
          name: 'iPad Air 10.9" 64GB Wi-Fi',
          image:
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 1,
        price: '₦785,000.00',
        status: 'replaced',
        progress: 100,
        orderDate: '15 - 07 - 2025',
        expectedDelivery: '29 - 07 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Babatunde Osho',
          email: 'baba@phonepalace.ng',
          phone: '+234 812 345 6789',
          address: '41 Computer Village, Ikeja, Lagos',
        },
      },
    ],
    cancelled: [
      {
        id: '9',
        number: '#1537',
        product: {
          name: 'FAYA Wireless Earbuds Pro',
          image:
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 75,
        price: '₦3,375,000.00',
        status: 'cancelled',
        progress: 0,
        orderDate: '12 - 07 - 2025',
        expectedDelivery: '26 - 07 - 2025',
        isBulkOrder: true,
        customerDetails: {
          name: 'Aisha Mahmoud',
          email: 'aisha@accessoryworld.ng',
          phone: '+234 809 876 5432',
          address: '88 Balogun Market, Lagos Island',
        },
        affiliateCommission: 75000,
      },
      {
        id: '10',
        number: '#1535',
        product: {
          name: 'FAYA Bluetooth Speaker Pro',
          image:
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center',
        },
        quantity: 2,
        price: '₦110,000.00',
        status: 'cancelled',
        progress: 0,
        orderDate: '10 - 07 - 2025',
        expectedDelivery: '24 - 07 - 2025',
        isBulkOrder: false,
        customerDetails: {
          name: 'Chidi Okonkwo',
          email: 'chidi.okonkwo@business.ng',
          phone: '+234 807 123 9876',
          address: '33 Herbert Macaulay Way, Yaba, Lagos',
        },
      },
    ],
  }));

  // Transaction state management
  interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: string;
    description: string;
    date: string;
    orderNumber?: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // If parsing fails, return default transactions
        }
      }
    }
    return [
      {
        id: '1',
        type: 'credit',
        amount: '₦43,875.00',
        description: 'Order cancellation refund',
        date: '06 - 08 - 2025',
        orderNumber: '#1236',
      },
      {
        id: '2',
        type: 'debit',
        amount: '₦125,000.00',
        description: 'Purchase payment',
        date: '28 - 07 - 2025',
        orderNumber: '#1229',
      },
      {
        id: '3',
        type: 'credit',
        amount: '₦50,000.00',
        description: 'Wallet top-up',
        date: '25 - 07 - 2025',
      },
    ];
  });

  useEffect(() => {
    // Update transactions in local storage whenever they change
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    brand: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 5000000,
    selectedCategories: [],
    selectedBrands: [],
    selectedConditions: [],
    selectedStorage: [],
    selectedMemory: [],
    hasGraphicsCard: '',
    selectedGraphicsMemory: [],
    selectedWarranty: [],
  });

  // Define components inside AppContent where ThemeProvider context is available

  function MobileTitle({
    onBulkBuyer,
    onAdmin,
    onWallet,
  }: {
    onBulkBuyer: () => void;
    onAdmin: () => void;
    onWallet: () => void;
  }) {
    return (
      <div className="bg-background px-5 py-4">
        <div className="mb-2 flex items-start justify-between">
          <h1 className="mr-3 flex-1 text-foreground">
            Buy Gadgets from China
          </h1>
          <div className="flex gap-2">
            <button
              onClick={onAdmin}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <div className="h-4 w-4">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 14L12 14.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 10V8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Admin</span>
            </button>
            <button
              onClick={onWallet}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <div className="h-4 w-4">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 5 11.8954 5 13V19C5 20.1046 3.89543 21 5 21Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Wallet</span>
            </button>
            <button
              onClick={onBulkBuyer}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-white shadow-sm transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              <div className="h-4 w-4">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Bulk Buyer?</span>
            </button>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Get genuine brand new or pre-owned gadgets shipped from China in just
          10 business days. Every phone comes boxed with accessories, a full
          warranty, and extras like screen protectors and cases plus friendly
          after-sales support you can count on. Quality gadgets, delivered
          hassle-free.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when filter panel is open
  useEffect(() => {
    if (showFilterPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilterPanel]);

  // Helper function to extract numeric price from string
  const extractPrice = (priceString: string): number => {
    // Remove currency symbol, commas, and spaces, then parse the number before decimal
    const cleanedPrice = priceString.replace(/[₦,\s]/g, '').split('.')[0];
    const numericPrice = parseInt(cleanedPrice);
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        filters.searchQuery === '' ||
        product.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.searchQuery.toLowerCase());

      // Advanced filter panel filters
      const productPrice = extractPrice(product.price);
      const matchesPriceRange =
        productPrice >= filters.minPrice && productPrice <= filters.maxPrice;

      const matchesSelectedCategories =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(product.category);

      const matchesSelectedBrands =
        filters.selectedBrands.length === 0 ||
        filters.selectedBrands.includes(product.brand);

      const matchesSelectedConditions =
        filters.selectedConditions.length === 0 ||
        filters.selectedConditions.includes(product.condition);

      const matchesSelectedWarranty =
        filters.selectedWarranty.length === 0 ||
        (product.warranty &&
          filters.selectedWarranty.includes(product.warranty));

      return (
        matchesSearch &&
        matchesPriceRange &&
        matchesSelectedCategories &&
        matchesSelectedBrands &&
        matchesSelectedConditions &&
        matchesSelectedWarranty
      );
    });
  }, [filters, products]);

  // Calculate pagination values
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Wallet functions
  const handleWithdrawalConfirmed = (amount: number) => {
    console.log('handleWithdrawalConfirmed called with amount:', amount);
    console.log('Current wallet balance:', walletBalance);

    // Only set the pending withdrawal amount - don't subtract from balance yet
    setPendingWithdrawal(amount);
    // The balance will be reduced when the withdrawal is actually processed/completed
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleShowFilterPanel = () => {
    setShowFilterPanel(true);
  };

  const handleCloseFilterPanel = () => {
    setShowFilterPanel(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    setSelectedProduct(null);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowCart = () => {
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowOrders = () => {
    setCurrentView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowWallet = () => {
    setCurrentView('wallet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowManageAdmins = () => {
    setCurrentView('manage-admins');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateAdmin = () => {
    setCurrentView('create-admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToManageAdmins = () => {
    setCurrentView('manage-admins');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditAdmin = () => {
    setCurrentView('edit-admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = (product?: Product, quantity?: number) => {
    if (product) {
      setCheckoutProduct(product);
      setCheckoutQuantity(quantity || 1);
    } else {
      setCheckoutProduct(null);
      setCheckoutQuantity(1);
    }
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaySmallSmall = (product: Product, quantity: number) => {
    // For now, we'll show an alert - this can be expanded later
    alert(
      `Pay Small Small selected for ${product.title} (Quantity: ${quantity})\n\nThis feature allows flexible payment options. Implementation coming soon!`,
    );
  };

  const handleBulkBuyer = () => {
    setShowBulkBuyerDialog(true);
  };

  const handleCloseBulkBuyerDialog = () => {
    setShowBulkBuyerDialog(false);
  };

  // Save wallet state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletBalance', walletBalance.toString());
    }
  }, [walletBalance]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingWithdrawal', pendingWithdrawal.toString());
    }
  }, [pendingWithdrawal]);

  // Order functions
  const handleOrdersUpdate = (updatedOrders: Record<OrderTab, Order[]>) => {
    setOrders(updatedOrders);
  };

  const handleOrderRefund = (refundAmount: number, orderNumber: string) => {
    setWalletBalance((prevBalance) => prevBalance + refundAmount);

    // Add refund transaction to transaction history
    const newTransaction: Transaction = {
      id: `refund-${Date.now()}`,
      type: 'credit',
      amount: `₦${refundAmount.toLocaleString()}.00`,
      description: 'Order cancellation refund',
      date: new Date()
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, ' - '),
      orderNumber: orderNumber,
    };

    setTransactions((prevTransactions) => [
      newTransaction,
      ...prevTransactions,
    ]);
  };

  // Product management functions for admin
  const handleProductUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleOrderStatusUpdate = (
    orderId: string,
    newStatus: Order['status'],
    tab: OrderTab,
  ) => {
    const updatedOrders = { ...orders };
    Object.keys(updatedOrders).forEach((tabKey) => {
      updatedOrders[tabKey as OrderTab] = updatedOrders[tabKey as OrderTab].map(
        (order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
      );
    });
    setOrders(updatedOrders);
  };

  // Bulk order creation function
  const handleBulkOrderCreate = (bulkOrder: BulkOrder) => {
    // Convert bulk order items to individual orders
    const newOrders: Order[] = bulkOrder.items.map((item, index) => {
      const product = products.find((p) => p.id === item.productId);

      return {
        id: `${bulkOrder.id}-item-${index}`,
        number:
          index === 0
            ? bulkOrder.orderNumber
            : `${bulkOrder.orderNumber}-${index + 1}`,
        product: {
          name: item.productName,
          image:
            product?.image ||
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center',
        },
        quantity: item.quantity,
        price: `₦${item.totalPrice.toLocaleString()}.00`,
        status: bulkOrder.status,
        progress: 25, // Initial progress for confirmed orders
        orderDate: bulkOrder.orderDate,
        expectedDelivery: bulkOrder.expectedDelivery,
        isBulkOrder: true,
        customerDetails: bulkOrder.customerDetails,
        affiliateCommission: item.affiliateCommission,
      };
    });

    // Add orders to the upcoming tab
    const updatedOrders = {
      ...orders,
      upcoming: [...orders.upcoming, ...newOrders],
    };

    setOrders(updatedOrders);

    // Success message is now handled by the BulkOrderSuccessDialog component
  };

  // Returns order creation function
  const handleReturnsOrderCreate = (returnsOrder: any) => {
    // Create a new order entry for the returns order
    const returnOrder: Order = {
      id: returnsOrder.id,
      number: returnsOrder.orderNumber,
      product: {
        name: returnsOrder.returnedProduct.productName,
        image:
          products.find((p) => p.id === returnsOrder.returnedProduct.productId)
            ?.image ||
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center',
      },
      quantity: returnsOrder.returnedProduct.quantity,
      price: `₦${returnsOrder.returnedProduct.originalPrice.toLocaleString()}.00`,
      status: returnsOrder.status, // Will be 'confirmed' initially
      progress: 25, // Initial progress for confirmed returns
      orderDate: returnsOrder.orderDate,
      expectedDelivery: returnsOrder.expectedDelivery,
      isBulkOrder: false,
      customerDetails: returnsOrder.customerDetails,
      affiliateCommission: 0, // Returns orders don't generate commission
    };

    // Add the returns order to the returned tab
    const updatedOrders = {
      ...orders,
      returned: [...orders.returned, returnOrder],
    };

    setOrders(updatedOrders);
  };

  // Render based on current view
  if (currentView === 'cart') {
    return (
      <>
        <Cart
          cartItems={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          onBackToStore={handleBackToStore}
          onBulkBuyer={handleBulkBuyer}
          onCheckout={() => handleCheckout()}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'checkout') {
    return (
      <>
        <Checkout
          cartItems={checkoutProduct ? undefined : cartItems}
          singleProduct={
            checkoutProduct
              ? { ...checkoutProduct, quantity: checkoutQuantity }
              : undefined
          }
          onBackToCart={checkoutProduct ? undefined : handleShowCart}
          onBackToProduct={
            checkoutProduct
              ? () => {
                  setSelectedProduct(checkoutProduct);
                  setCurrentView('product');
                  setCheckoutProduct(null);
                }
              : undefined
          }
          onBulkBuyer={handleBulkBuyer}
          onGoToOrders={handleShowOrders}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'product' && selectedProduct) {
    return (
      <>
        <ProductDetails
          product={selectedProduct}
          onBackToStore={handleBackToStore}
          onAddToCart={addToCart}
          onBuyNow={(product, quantity) => handleCheckout(product, quantity)}
          onPaySmallSmall={handlePaySmallSmall}
          onBulkBuyer={handleBulkBuyer}
          cartItems={cartItems}
          onGoToCart={handleShowCart}
          onCheckout={(quantity) => handleCheckout(selectedProduct, quantity)}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'orders') {
    return (
      <>
        <MyOrders
          orders={orders}
          onOrdersUpdate={handleOrdersUpdate}
          onBackToStore={handleBackToStore}
          onBulkBuyer={handleBulkBuyer}
          onGoToWallet={handleShowWallet}
          onOrderRefund={handleOrderRefund}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'wallet') {
    return (
      <>
        <Wallet
          balance={walletBalance}
          pendingWithdrawal={pendingWithdrawal}
          transactions={transactions}
          onBackToStore={handleBackToStore}
          onBulkBuyer={handleBulkBuyer}
          onWithdrawalConfirmed={handleWithdrawalConfirmed}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'admin') {
    return (
      <>
        <AdminAuth
          products={products}
          orders={orders}
          onProductUpdate={handleProductUpdate}
          onOrderStatusUpdate={handleOrderStatusUpdate}
          onBackToStore={handleBackToStore}
          onBulkBuyer={handleBulkBuyer}
          onBulkOrderCreate={handleBulkOrderCreate}
          onReturnsOrderCreate={handleReturnsOrderCreate}
          walletBalance={walletBalance}
          transactions={transactions}
          onShowManageAdmins={handleShowManageAdmins}
        />
      </>
    );
  }

  if (currentView === 'manage-admins') {
    return (
      <>
        <AdminUserManagement
          onCreateNewAdmin={handleCreateAdmin}
          onEditAdmin={handleEditAdmin}
          onBackToAdmin={handleBackToAdmin}
          onBackToStore={handleBackToStore}
          onBulkBuyer={handleBulkBuyer}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'create-admin') {
    return (
      <>
        <AdminSignUp
          onSignUpSuccess={handleBackToManageAdmins}
          onBackToSignIn={handleBackToManageAdmins}
          isStandalone={true}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  if (currentView === 'edit-admin') {
    return (
      <>
        <AdminEditProfile
          onEditSuccess={handleBackToManageAdmins}
          onCancel={handleBackToManageAdmins}
        />
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </>
    );
  }

  // Main store view
  return (
    <>
      <div className="min-h-screen bg-background">
        {isMobile ? (
          <>
            <MobileHeader />
            <MobileTitle
              onBulkBuyer={handleBulkBuyer}
              onAdmin={handleShowAdmin}
              onWallet={handleShowWallet}
            />
            <MobileSearchFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onShowFilterPanel={handleShowFilterPanel}
              onShowCart={handleShowCart}
              onShowOrders={handleShowOrders}
              cartItemCount={cartItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )}
            />
            <div className="px-5 pb-24 pt-2">
              <div className="grid grid-cols-2 gap-4">
                {currentProducts.map((product) => (
                  <MobileProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
              <MobileBottomNav
                cartItemCount={cartItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )}
                onShowCart={handleShowCart}
                onShowOrders={handleShowOrders}
                onShowWallet={handleShowWallet}
                onShowStore={handleBackToStore}
                currentView={currentView}
              />
            )}
          </>
        ) : (
          <>
            {/* Desktop Header */}
            <div className="sticky top-0 z-40 border-b border-border bg-background">
              <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo */}
                  <div
                    className="h-[24px] w-[200px] cursor-pointer bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: `url('${imgSureimportsReverse}')`,
                    }}
                    onClick={handleBackToStore}
                  />

                  {/* Navigation and Actions */}
                  <div className="flex items-center gap-6">
                    <SafeThemeToggle />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6">
              <div className="py-8">
                <div className="mb-8 flex items-start justify-between">
                  <div className="max-w-3xl flex-1">
                    <h1 className="mb-4 text-2xl font-medium text-foreground">
                      Buy Gadgets from China
                    </h1>
                    <p className="leading-relaxed text-muted-foreground">
                      Get genuine brand new or pre-owned gadgets shipped from
                      China in just 10 business days. Every phone comes boxed
                      with accessories, a full warranty, and extras like screen
                      protectors and cases plus friendly after-sales support you
                      can count on. Quality gadgets, delivered hassle-free.
                    </p>
                  </div>
                  <div className="ml-8 flex gap-2">
                    <button
                      onClick={handleShowAdmin}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                      <div className="h-4 w-4">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 14L12 14.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 10V8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Admin</span>
                    </button>
                    <button
                      onClick={handleShowWallet}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <div className="h-4 w-4">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 10H21M7 15H1M13 15H21M5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11H5C3.89543 11 5 11.8954 5 13V19C5 20.1046 3.89543 21 5 21Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Wallet</span>
                    </button>
                    <button
                      onClick={handleBulkBuyer}
                      className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      <div className="h-4 w-4">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M16 11V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V11M5 9H19L18 21H6L5 9Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 12V16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 12V16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12V16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Bulk Buyer?</span>
                    </button>
                  </div>
                </div>

                <SearchFilter
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onShowFilterPanel={handleShowFilterPanel}
                  onShowCart={handleShowCart}
                  onShowOrders={handleShowOrders}
                  cartItemCount={cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  )}
                />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilterPanel}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseFilterPanel}
          products={products}
        />

        {/* Bulk Buyer Dialog */}
        <BulkBuyerDialog
          isOpen={showBulkBuyerDialog}
          onClose={handleCloseBulkBuyerDialog}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
