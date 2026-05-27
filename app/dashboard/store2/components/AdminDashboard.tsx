// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Product, Order, OrderTab, BulkOrder } from './App';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  UserPlus,
  RotateCcw,
  Search,
  Filter,
  X,
  LogOut,
  Menu,
  BarChart3,
  PieChart,
  Download,
  Activity,
  Target,
  Settings,
} from 'lucide-react';
import BulkOrderCreateDialog from './BulkOrderCreateDialog';
import ReturnsOrderCreateDialog, {
  ReturnsOrder,
} from './ReturnsOrderCreateDialog';
import { useAdminAuth, AdminPermissions } from './AdminAuthProvider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { ImagePicker } from './ImagePicker';
import { AdminSettings } from './admin/AdminSettings';
import {
  StoreSettings,
  SettingsManager,
  getStoreSettings,
} from './admin/SettingsManager';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onBulkBuyer: () => void;
  products: Product[];
  onProductUpdate: (products: Product[]) => void;
  orders: Record<OrderTab, Order[]> | null;
  onOrderStatusUpdate: (
    orderId: string,
    newStatus: Order['status'],
    tab: OrderTab,
  ) => void;
  onBulkOrderCreate?: (bulkOrder: BulkOrder) => void;
  onReturnsOrderCreate?: (returnsOrder: ReturnsOrder) => void;
  walletBalance: number;
  transactions: any[];
  onShowUserManagement?: () => void;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
}

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockItems: number;
}

interface SalesData {
  month: string;
  sales: number;
  orders: number;
  revenue: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  preferredCategory: string;
}

export function AdminDashboard({
  onBackToStore,
  onBulkBuyer,
  products,
  onProductUpdate,
  orders,
  onOrderStatusUpdate,
  onBulkOrderCreate,
  onReturnsOrderCreate,
  walletBalance,
  transactions,
  onShowUserManagement,
  hasPermission,
}: AdminDashboardProps) {
  const { currentAdmin, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState('basic');
  const [activeEditProductTab, setActiveEditProductTab] = useState('basic');
  const [isCreatingBulkOrder, setIsCreatingBulkOrder] = useState(false);
  const [isCreatingReturnsOrder, setIsCreatingReturnsOrder] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerData | null>(
    null,
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Product filters
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productBrandFilter, setProductBrandFilter] = useState('All');
  const [productConditionFilter, setProductConditionFilter] = useState('All');

  // Order filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');

  // Customer filters
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('All');

  // Settings state management
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() =>
    getStoreSettings(),
  );
  const [settingsManager] = useState(
    () => new SettingsManager(storeSettings, setStoreSettings),
  );

  // Update settings manager when settings change
  useEffect(() => {
    settingsManager.settings = storeSettings;
  }, [storeSettings, settingsManager]);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: '',
    supplierPrice: 0,
    affiliateCommission: 20000,
    brand: '',
    category: 'Laptops',
    condition: 'Brand new',
    image: '',
    rating: 5,
    storage: 'none',
    memory: 'none',
    hasGraphicsCard: false,
    graphicsMemory: 'none',
    warranty: '12 months',
    features: '',
    paySmallSmall: storeSettings.paySmallSmallDefault,
  });

  // Mock customer data derived from orders
  const mockCustomers: CustomerData[] = useMemo(() => {
    if (!orders) return [];

    const allOrders = Object.values(orders).flat();
    const customerMap = new Map<string, CustomerData>();

    allOrders.forEach((order) => {
      if (order.customerDetails) {
        const existingCustomer = customerMap.get(order.customerDetails.email);
        const orderValue = parseFloat(order.price.replace(/[₦,]/g, ''));

        if (existingCustomer) {
          existingCustomer.totalOrders += 1;
          existingCustomer.totalSpent += orderValue;
          if (
            new Date(order.orderDate) > new Date(existingCustomer.lastOrderDate)
          ) {
            existingCustomer.lastOrderDate = order.orderDate;
          }
        } else {
          customerMap.set(order.customerDetails.email, {
            id: Math.random().toString(36).substr(2, 9),
            name: order.customerDetails.name,
            email: order.customerDetails.email,
            phone: order.customerDetails.phone,
            address: order.customerDetails.address,
            totalOrders: 1,
            totalSpent: orderValue,
            lastOrderDate: order.orderDate,
            status: Math.random() > 0.2 ? 'active' : 'inactive',
            preferredCategory: ['Laptops', 'Phones', 'Tablets', 'Accessories'][
              Math.floor(Math.random() * 4)
            ],
          });
        }
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  // Export functions
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value =
              typeof row[header] === 'object'
                ? JSON.stringify(row[header])
                : row[header];
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${filename}_${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProducts = () => {
    const headers = [
      'id',
      'title',
      'description',
      'price',
      'supplierPrice',
      'affiliateCommission',
      'brand',
      'category',
      'condition',
      'rating',
      'storage',
      'memory',
      'warranty',
    ];
    const exportData = filteredProducts.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      supplierPrice: product.supplierPrice,
      affiliateCommission: product.affiliateCommission,
      brand: product.brand,
      category: product.category,
      condition: product.condition,
      rating: product.rating,
      storage: product.storage || 'N/A',
      memory: product.memory || 'N/A',
      warranty: product.warranty || 'N/A',
    }));
    exportToCSV(exportData, 'products_export', headers);
  };

  const exportOrders = () => {
    const headers = [
      'orderNumber',
      'productName',
      'customerName',
      'customerEmail',
      'customerPhone',
      'quantity',
      'price',
      'status',
      'orderDate',
      'expectedDelivery',
      'isBulkOrder',
    ];
    const exportData = filteredOrders.map((order) => ({
      orderNumber: order.number,
      productName: order.product.name,
      customerName: order.customerDetails?.name || 'N/A',
      customerEmail: order.customerDetails?.email || 'N/A',
      customerPhone: order.customerDetails?.phone || 'N/A',
      quantity: order.quantity,
      price: order.price,
      status: order.status,
      orderDate: order.orderDate,
      expectedDelivery: order.expectedDelivery,
      isBulkOrder: order.isBulkOrder ? 'Yes' : 'No',
    }));
    exportToCSV(exportData, 'orders_export', headers);
  };

  const exportCustomers = () => {
    const headers = [
      'id',
      'name',
      'email',
      'phone',
      'address',
      'totalOrders',
      'totalSpent',
      'lastOrderDate',
      'status',
      'preferredCategory',
    ];
    const exportData = filteredCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      lastOrderDate: customer.lastOrderDate,
      status: customer.status,
      preferredCategory: customer.preferredCategory,
    }));
    exportToCSV(exportData, 'customers_export', headers);
  };

  const exportAnalytics = () => {
    const headers = ['metric', 'value'];
    const exportData = [
      { metric: 'Total Products', value: stats.totalProducts },
      { metric: 'Total Orders', value: stats.totalOrders },
      { metric: 'Total Revenue (₦)', value: stats.totalRevenue },
      { metric: 'Total Customers', value: stats.totalCustomers },
      { metric: 'Pending Orders', value: stats.pendingOrders },
      { metric: 'Low Stock Items', value: stats.lowStockItems },
      ...salesData.map((data) => ({
        metric: `${data.month} Sales`,
        value: data.sales,
      })),
      ...salesData.map((data) => ({
        metric: `${data.month} Revenue (₦)`,
        value: data.revenue,
      })),
      ...categoryData.map((data) => ({
        metric: `${data.name} Products (%)`,
        value: data.value,
      })),
    ];
    exportToCSV(exportData, 'analytics_export', headers);
  };

  // Pricing calculations
  const calculateStorePrice = (supplierPrice: number, category: string) => {
    const formula =
      storeSettings.pricingFormulas[category] ||
      storeSettings.pricingFormulas['Phones'];
    const storePriceNaira =
      (supplierPrice + formula.addition) * formula.multiplier;
    return `₦${storePriceNaira.toLocaleString()}.00`;
  };

  const getDefaultCommission = (category: string) => {
    const formula =
      storeSettings.pricingFormulas[category] ||
      storeSettings.pricingFormulas['Phones'];
    return formula.commission;
  };

  // Auto-calculate store price and affiliate commission when supplier price or category changes
  useEffect(() => {
    if (newProduct.supplierPrice && newProduct.category) {
      const autoCalculatedPrice = calculateStorePrice(
        newProduct.supplierPrice,
        newProduct.category,
      );
      const autoCalculatedCommission = getDefaultCommission(
        newProduct.category,
      );

      setNewProduct((prev) => ({
        ...prev,
        price: autoCalculatedPrice,
        affiliateCommission: autoCalculatedCommission,
      }));
    }
  }, [newProduct.supplierPrice, newProduct.category]);

  // Auto-calculate store price for editing product
  useEffect(() => {
    if (
      editingProduct &&
      editingProduct.supplierPrice &&
      editingProduct.category
    ) {
      const autoCalculatedPrice = calculateStorePrice(
        editingProduct.supplierPrice,
        editingProduct.category,
      );
      const autoCalculatedCommission = getDefaultCommission(
        editingProduct.category,
      );

      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              price: autoCalculatedPrice,
              affiliateCommission: autoCalculatedCommission,
            }
          : null,
      );
    }
  }, [editingProduct?.supplierPrice, editingProduct?.category]);

  // Get available tabs based on permissions
  const getAvailableTabs = () => {
    const tabs = [];

    if (hasPermission('overview')) {
      tabs.push({ value: 'overview', label: 'Overview', icon: BarChart3 });
    }
    if (hasPermission('products')) {
      tabs.push({
        value: 'products',
        label: 'Product Management',
        icon: Package,
      });
    }
    if (hasPermission('orders')) {
      tabs.push({
        value: 'orders',
        label: 'Order Management',
        icon: ShoppingCart,
      });
    }
    if (hasPermission('customers')) {
      tabs.push({
        value: 'customers',
        label: 'Customer Management',
        icon: Users,
      });
    }
    if (hasPermission('reports')) {
      tabs.push({
        value: 'analytics',
        label: 'Analytics & Reports',
        icon: PieChart,
      });
    }

    // Settings tab - only show for super admins
    if (currentAdmin?.role === 'super_admin') {
      tabs.push({ value: 'settings', label: 'Store Settings', icon: Settings });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // If user has no permissions, show access denied message
  if (availableTabs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToStore}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Logged in as</p>
                <p className="font-medium text-foreground">
                  {currentAdmin?.name}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut();
                  onBackToStore();
                }}
                className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <Card className="p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
            <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
            <p className="mb-4 text-muted-foreground">
              You don't have permission to access any admin dashboard sections.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator to request the necessary
              permissions.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Get the first available tab as default
  const defaultTab = availableTabs[0]?.value || 'overview';

  // Set initial active tab
  useEffect(() => {
    if (
      availableTabs.length > 0 &&
      !availableTabs.find((tab) => tab.value === activeTab)
    ) {
      setActiveTab(defaultTab);
    }
  }, [availableTabs, activeTab, defaultTab]);

  // Product management functions
  const handleAddProduct = () => {
    if (
      newProduct.title &&
      newProduct.supplierPrice &&
      newProduct.category &&
      newProduct.brand
    ) {
      const product: Product = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        title: newProduct.title!,
        description: newProduct.description!,
        price: newProduct.price!,
        supplierPrice: newProduct.supplierPrice!,
        affiliateCommission: newProduct.affiliateCommission!,
        rating: newProduct.rating!,
        brand: newProduct.brand!,
        category: newProduct.category!,
        condition: newProduct.condition!,
        image:
          newProduct.image ||
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center',
        storage: newProduct.storage === 'none' ? undefined : newProduct.storage,
        memory: newProduct.memory === 'none' ? undefined : newProduct.memory,
        hasGraphicsCard: newProduct.hasGraphicsCard,
        graphicsMemory:
          newProduct.graphicsMemory === 'none'
            ? undefined
            : newProduct.graphicsMemory,
        warranty: newProduct.warranty,
        features: newProduct.features,
        paySmallSmall: newProduct.paySmallSmall,
      };

      onProductUpdate([...products, product]);
      setIsAddingProduct(false);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        supplierPrice: 0,
        affiliateCommission: 20000,
        brand: '',
        category: 'Laptops',
        condition: 'Brand new',
        image: '',
        rating: 5,
        storage: 'none',
        memory: 'none',
        hasGraphicsCard: false,
        graphicsMemory: 'none',
        warranty: '12 months',
        features: '',
        paySmallSmall: storeSettings.paySmallSmallDefault,
      });
      setActiveProductTab('basic');
    }
  };

  const handleEditProduct = (product: Product) => {
    const updatedProducts = products.map((p) =>
      p.id === product.id ? product : p,
    );
    onProductUpdate(updatedProducts);
    setEditingProduct(null);
    setActiveEditProductTab('basic');
  };

  const handleDeleteProduct = (productId: number) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    onProductUpdate(updatedProducts);
  };

  // Calculate admin statistics
  const calculateStats = (): AdminStats => {
    const allOrders = orders ? Object.values(orders).flat() : [];
    const totalRevenue = allOrders.reduce((sum, order) => {
      const price = parseFloat(order.price.replace(/[₦,]/g, ''));
      return sum + price;
    }, 0);

    return {
      totalProducts: products.length,
      totalOrders: allOrders.length,
      totalRevenue,
      totalCustomers: mockCustomers.length,
      pendingOrders: allOrders.filter(
        (order) => order.status === 'confirmed' || order.status === 'shipped',
      ).length,
      lowStockItems: Math.floor(products.length * 0.15), // Mock 15% low stock
    };
  };

  const stats = calculateStats();

  // Sales data for visual representations
  const salesData: SalesData[] = useMemo(
    () => [
      { month: 'Jan', sales: 145, orders: 145, revenue: 4500000 },
      { month: 'Feb', sales: 167, orders: 167, revenue: 5200000 },
      { month: 'Mar', sales: 156, orders: 156, revenue: 4800000 },
      { month: 'Apr', sales: 198, orders: 198, revenue: 6100000 },
      { month: 'May', sales: 189, orders: 189, revenue: 5700000 },
      { month: 'Jun', sales: 221, orders: 221, revenue: 6800000 },
      { month: 'Jul', sales: 234, orders: 234, revenue: 7200000 },
      { month: 'Aug', sales: 267, orders: 267, revenue: 8100000 },
    ],
    [],
  );

  const categoryData: CategoryData[] = useMemo(
    () => [
      { name: 'Laptops', value: 45, color: '#8884d8' },
      { name: 'Phones', value: 30, color: '#82ca9d' },
      { name: 'Tablets', value: 15, color: '#ffc658' },
      { name: 'Accessories', value: 10, color: '#ff7300' },
    ],
    [],
  );

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  const handleSignOut = () => {
    signOut();
    onBackToStore();
  };

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        productSearchQuery === '' ||
        product.title
          .toLowerCase()
          .includes(productSearchQuery.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(productSearchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(productSearchQuery.toLowerCase());

      const matchesCategory =
        productCategoryFilter === 'All' ||
        product.category === productCategoryFilter;
      const matchesBrand =
        productBrandFilter === 'All' || product.brand === productBrandFilter;
      const matchesCondition =
        productConditionFilter === 'All' ||
        product.condition === productConditionFilter;

      return (
        matchesSearch && matchesCategory && matchesBrand && matchesCondition
      );
    });
  }, [
    products,
    productSearchQuery,
    productCategoryFilter,
    productBrandFilter,
    productConditionFilter,
  ]);

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    const allOrders = Object.values(orders).flat();
    return allOrders.filter((order) => {
      const matchesSearch =
        orderSearchQuery === '' ||
        order.number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.product.name
          .toLowerCase()
          .includes(orderSearchQuery.toLowerCase()) ||
        order.customerDetails?.name
          .toLowerCase()
          .includes(orderSearchQuery.toLowerCase()) ||
        order.customerDetails?.email
          .toLowerCase()
          .includes(orderSearchQuery.toLowerCase());

      const matchesStatus =
        orderStatusFilter === 'All' || order.status === orderStatusFilter;
      const matchesType =
        orderTypeFilter === 'All' ||
        (orderTypeFilter === 'Bulk' && order.isBulkOrder) ||
        (orderTypeFilter === 'Regular' && !order.isBulkOrder);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, orderSearchQuery, orderStatusFilter, orderTypeFilter]);

  // Filter customers based on current filters
  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesSearch =
        customerSearchQuery === '' ||
        customer.name
          .toLowerCase()
          .includes(customerSearchQuery.toLowerCase()) ||
        customer.email
          .toLowerCase()
          .includes(customerSearchQuery.toLowerCase()) ||
        customer.phone
          .toLowerCase()
          .includes(customerSearchQuery.toLowerCase());

      const matchesStatus =
        customerStatusFilter === 'All' ||
        customer.status === customerStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mockCustomers, customerSearchQuery, customerStatusFilter]);

  // Get unique values for filter dropdowns
  const productCategories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const productBrands = [
    'All',
    ...Array.from(new Set(products.map((p) => p.brand))),
  ];
  const productConditions = [
    'All',
    ...Array.from(new Set(products.map((p) => p.condition))),
  ];

  const orderStatuses = [
    'All',
    'confirmed',
    'shipped',
    'arrived',
    'delivered',
    'cancelled',
    'replaced',
    'shipped-back',
    'arrived-back',
  ];

  if (!currentAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex h-14 items-center justify-between py-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToStore}
                  className="flex h-8 flex-shrink-0 items-center gap-1 px-2"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span className="text-xs">Store</span>
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-sm font-medium">
                    Admin Dashboard
                  </h1>
                  <p className="truncate text-xs text-muted-foreground">
                    {currentAdmin.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-1">
                {hasPermission('userManagement') &&
                  currentAdmin.role === 'super_admin' && (
                    <Button
                      onClick={onShowUserManagement}
                      variant="outline"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Users className="h-3 w-3" />
                    </Button>
                  )}

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="h-8 border-red-200 px-2 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden h-16 items-center justify-between md:flex">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToStore}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  Welcome back, {currentAdmin.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasPermission('userManagement') &&
                currentAdmin.role === 'super_admin' && (
                  <Button
                    onClick={onShowUserManagement}
                    variant="outline"
                    size="sm"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage Admins
                  </Button>
                )}

              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-3 md:px-6 md:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tab Navigation */}
          <div className="mb-8 hidden md:block">
            <div className="border-b border-border pb-6">
              <TabsList className="inline-flex h-11 items-center justify-center rounded-lg bg-muted/50 p-1 text-muted-foreground">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="mb-4 md:hidden">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {/* Current Tab Indicator */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const currentTab = availableTabs.find(
                      (tab) => tab.value === activeTab,
                    );
                    const Icon = currentTab?.icon || Settings;
                    return (
                      <>
                        <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="truncate text-sm font-medium text-foreground">
                          {currentTab?.label || 'Admin Section'}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <div className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                  {availableTabs.findIndex((tab) => tab.value === activeTab) +
                    1}{' '}
                  of {availableTabs.length}
                </div>
              </div>

              {/* Tab Navigation Buttons */}
              <div className="space-y-1 p-2">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.value;
                  return (
                    <Button
                      key={tab.value}
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab.value)}
                      className={`h-11 w-full justify-start gap-3 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-left">
                        {tab.label
                          .replace(' Management', '')
                          .replace(' & Reports', '')}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {hasPermission('overview') && (
            <TabsContent value="overview" className="mt-0 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {formatCurrency(stats.totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {stats.totalOrders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {stats.totalProducts}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                      +2 new this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
                  <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Customers
                    </CardTitle>
                    <Users className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-2xl font-bold">
                      {stats.totalCustomers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Button
                      onClick={() => setIsCreatingBulkOrder(true)}
                      className="flex h-12 items-center gap-2"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                      Create Bulk Order
                    </Button>

                    <Button
                      onClick={() => setIsCreatingReturnsOrder(true)}
                      className="flex h-12 items-center gap-2"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Process Return
                    </Button>

                    <Button
                      onClick={exportAnalytics}
                      className="flex h-12 items-center gap-2"
                      variant="outline"
                    >
                      <Download className="h-4 w-4" />
                      Export Overview Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Products Tab */}
          {hasPermission('products') && (
            <TabsContent value="products" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Product Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your store inventory and product listings
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={exportProducts}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Products
                  </Button>
                  <Button
                    onClick={() => setIsAddingProduct(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Product Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          value={productSearchQuery}
                          onChange={(e) =>
                            setProductSearchQuery(e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={productCategoryFilter}
                        onValueChange={setProductCategoryFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Select
                        value={productBrandFilter}
                        onValueChange={setProductBrandFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productBrands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select
                        value={productConditionFilter}
                        onValueChange={setProductConditionFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {productConditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Products ({filteredProducts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Condition</TableHead>
                          <TableHead>Store Price</TableHead>
                          <TableHead>Supplier Price (RMB)</TableHead>
                          <TableHead>Commission (₦)</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.slice(0, 10).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    typeof product.image === 'string'
                                      ? product.image
                                      : 'null'
                                  }
                                  alt={product.title}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="line-clamp-1 text-sm font-medium">
                                    {product.title}
                                  </p>
                                  <p className="line-clamp-1 text-xs text-muted-foreground">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.condition === 'Brand new'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {product.condition}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.price}
                            </TableCell>
                            <TableCell>¥{product.supplierPrice}</TableCell>
                            <TableCell>
                              ₦{product.affiliateCommission.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Product
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "
                                        {product.title}"? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteProduct(product.id)
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filteredProducts.length > 10 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 of {filteredProducts.length} products. Export
                        to see all data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Orders Tab */}
          {hasPermission('orders') && (
            <TabsContent value="orders" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Order Management</h2>
                  <p className="text-sm text-muted-foreground">
                    Track and manage customer orders
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={exportOrders}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Orders
                  </Button>
                  <Button
                    onClick={() => setIsCreatingBulkOrder(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Bulk Order
                  </Button>
                </div>
              </div>

              {/* Order Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                          placeholder="Search orders..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={orderStatusFilter}
                        onValueChange={setOrderStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <Select
                        value={orderTypeFilter}
                        onValueChange={setOrderTypeFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Bulk">Bulk Orders</SelectItem>
                          <SelectItem value="Regular">
                            Regular Orders
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.slice(0, 10).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.number}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={order.product.image}
                                  alt={order.product.name}
                                  className="h-8 w-8 rounded object-cover"
                                />
                                <span className="line-clamp-1 text-sm">
                                  {order.product.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">
                                  {order.customerDetails?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customerDetails?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell className="font-medium">
                              {order.price}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === 'delivered'
                                    ? 'default'
                                    : order.status === 'cancelled'
                                      ? 'destructive'
                                      : order.status === 'shipped'
                                        ? 'secondary'
                                        : 'outline'
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.orderDate}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.isBulkOrder ? 'secondary' : 'outline'
                                }
                              >
                                {order.isBulkOrder ? 'Bulk' : 'Regular'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingOrder(order)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filteredOrders.length > 10 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 of {filteredOrders.length} orders. Export to
                        see all data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Customers Tab */}
          {hasPermission('customers') && (
            <TabsContent value="customers" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Customer Management</h2>
                  <p className="text-sm text-muted-foreground">
                    View and manage customer information
                  </p>
                </div>
                <Button
                  onClick={exportCustomers}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Customers
                </Button>
              </div>

              {/* Customer Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                          placeholder="Search customers..."
                          value={customerSearchQuery}
                          onChange={(e) =>
                            setCustomerSearchQuery(e.target.value)
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={customerStatusFilter}
                        onValueChange={setCustomerStatusFilter}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customers Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Total Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Last Order</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Preferred Category</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.slice(0, 10).map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {customer.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{customer.phone}</p>
                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                  {customer.address}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {customer.totalOrders}
                            </TableCell>
                            <TableCell className="font-medium">
                              ₦{customer.totalSpent.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-sm">
                              {customer.lastOrderDate}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  customer.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {customer.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {customer.preferredCategory}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingCustomer(customer)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {filteredCustomers.length > 10 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Showing 10 of {filteredCustomers.length} customers.
                        Export to see all data.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Analytics Tab */}
          {hasPermission('reports') && (
            <TabsContent value="analytics" className="mt-0 space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Analytics & Reports</h2>
                  <p className="text-sm text-muted-foreground">
                    View detailed analytics and generate reports
                  </p>
                </div>
                <Button
                  onClick={exportAnalytics}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Analytics Data
                </Button>
              </div>

              {/* Analytics Content */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Sales Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {salesData.slice(-4).map((data, index) => (
                        <div
                          key={data.month}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{data.month}</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{
                                  width: `${(data.sales / 300) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {data.sales}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Category Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryData.map((category) => (
                        <div
                          key={category.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {category.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Key Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₦
                        {(
                          stats.totalRevenue / stats.totalOrders
                        ).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average Order Value
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(
                          ((stats.totalOrders - stats.pendingOrders) /
                            stats.totalOrders) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Order Completion Rate
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(stats.totalOrders / stats.totalCustomers).toFixed(1)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Orders per Customer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Settings Tab */}
          {currentAdmin?.role === 'super_admin' && (
            <TabsContent value="settings" className="mt-0 space-y-6">
              <AdminSettings
                settings={storeSettings}
                onUpdateSettings={setStoreSettings}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Dialogs */}
      {isCreatingBulkOrder && (
        <BulkOrderCreateDialog
          products={products}
          onCreateOrder={onBulkOrderCreate || (() => {})}
          onClose={() => setIsCreatingBulkOrder(false)}
        />
      )}

      {isCreatingReturnsOrder && (
        <ReturnsOrderCreateDialog
          products={products}
          onCreateOrder={onReturnsOrderCreate || (() => {})}
          onClose={() => setIsCreatingReturnsOrder(false)}
        />
      )}
    </div>
  );
}
