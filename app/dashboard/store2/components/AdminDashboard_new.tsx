"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Product, Order, OrderTab, BulkOrder } from '../App';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, TrendingDown, Package, Users, DollarSign, ShoppingCart, AlertTriangle, CheckCircle, UserPlus, Calendar, Clock, MapPin, Phone, Mail, User, CreditCard, Star, Truck, RotateCcw, Search, Filter, X, Settings, Save } from 'lucide-react';
import BulkOrderCreateDialog from './BulkOrderCreateDialog';
import ReturnsOrderCreateDialog, { ReturnsOrder } from './ReturnsOrderCreateDialog';
import { Switch } from "./ui/switch";

interface AdminDashboardProps {
  onBackToStore: () => void;
  onBulkBuyer: () => void;
  products: Product[];
  onProductUpdate: (products: Product[]) => void;
  orders: Record<OrderTab, Order[]> | null;
  onOrderStatusUpdate: (orderId: string, newStatus: Order['status'], tab: OrderTab) => void;
  onBulkOrderCreate?: (bulkOrder: BulkOrder) => void;
  onReturnsOrderCreate?: (returnsOrder: ReturnsOrder) => void;
  walletBalance: number;
  transactions: any[];
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
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export default function AdminDashboard({
  onBackToStore,
  onBulkBuyer,
  products,
  onProductUpdate,
  orders,
  onOrderStatusUpdate,
  onBulkOrderCreate,
  onReturnsOrderCreate,
  walletBalance,
  transactions
}: AdminDashboardProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState('basic');
  const [activeEditProductTab, setActiveEditProductTab] = useState('basic');
  const [isCreatingBulkOrder, setIsCreatingBulkOrder] = useState(false);
  const [isCreatingReturnsOrder, setIsCreatingReturnsOrder] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Search and filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productBrandFilter, setProductBrandFilter] = useState('all');
  const [productConditionFilter, setProductConditionFilter] = useState('all');
  const [productVisibilityFilter, setProductVisibilityFilter] = useState('all');
  
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [orderDateFilter, setOrderDateFilter] = useState('all');
  
  // Settings state management
  const [storeSettings, setStoreSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('storeSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // If parsing fails, return default settings
        }
      }
    }
    return {
      categories: {
        'Laptops': ['HP', 'Macbooks', 'ASUS', 'Lenovo', 'Dell', 'Acer'],
        'Phones': ['Apple', 'Samsung', 'Google Pixel', 'Redmi', 'OnePlus', 'Huawei'],
        'Tablets': ['Apple', 'Samsung', 'Microsoft', 'Huawei'],
        'Accessories': ['FAYA', 'Anker', 'Belkin', 'JBL', 'Sony']
      },
      conditions: ['Brand new', 'Pre-owned', 'Refurbished', 'Open box'],
      storage: ['32G', '64G', '128G', '256G', '512G', '1TB', '2TB'],
      memory: ['2G', '4G', '8G', '16G', '32G', '64G'],
      graphicsMemory: ['2G', '4G', '6G', '8G', '12G', '16G', '24G'],
      warranty: ['3 months', '6 months', '12 months', '24 months', '36 months'],
      pricingFormulas: {
        'Phones': { addition: 500, multiplier: 225, commission: 20000 },
        'Tablets': { addition: 500, multiplier: 225, commission: 20000 },
        'Laptops': { addition: 750, multiplier: 225, commission: 20000 },
        'Accessories': { addition: 0, multiplier: 225, commission: 1000 }
      },
      deliveryTime: 10,
      currency: 'NGN',
      storeName: 'Buy Gadgets from China',
      storeDescription: 'Get genuine brand new or pre-owned gadgets shipped from China in just 10 business days. Every phone comes boxed with accessories, a full warranty, and extras like screen protectors and cases plus friendly after-sales support you can count on. Quality gadgets, delivered hassle-free.',
      paySmallSmallDefault: 'Own this item without the financial strain! Spread your payments anyhow you want and enjoy smooth, flexible financing. No credit or debit card required. No fixed payment amount. We will create a dedicated account for you and you transfer money to the account as many times as you want. When you complete payment, we ship from China to you. Our estimated delivery timeline is 10 business days to our Lagos office.'
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
    }
  }, [storeSettings]);

  // Settings editing states
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<{ category: string; brand: string } | null>(null);
  const [editingListField, setEditingListField] = useState<{ field: string; value: string; index: number } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newListFieldValue, setNewListFieldValue] = useState('');
  const [activeSettingsTab, setActiveSettingsTab] = useState('categories');

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
    paySmallSmall: 'Own this item without the financial strain! Spread your payments anyhow you want and enjoy smooth, flexible financing. No credit or debit card required. No fixed payment amount. We will create a dedicated account for you and you transfer money to the account as many times as you want. When you complete payment, we ship from China to you. Our estimated delivery timeline is 10 business days to our Lagos office.'
  });

  // Settings management functions
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !storeSettings.categories[newCategoryName]) {
      setStoreSettings(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [newCategoryName]: []
        },
        pricingFormulas: {
          ...prev.pricingFormulas,
          [newCategoryName]: { addition: 500, multiplier: 225, commission: 20000 }
        }
      }));
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    const { [categoryName]: deleted, ...remainingCategories } = storeSettings.categories;
    const { [categoryName]: deletedFormula, ...remainingFormulas } = storeSettings.pricingFormulas;
    
    setStoreSettings(prev => ({
      ...prev,
      categories: remainingCategories,
      pricingFormulas: remainingFormulas
    }));
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    if (newName.trim() && newName !== oldName && !storeSettings.categories[newName]) {
      const categoryBrands = storeSettings.categories[oldName];
      const categoryFormula = storeSettings.pricingFormulas[oldName];
      
      const { [oldName]: deleted, ...otherCategories } = storeSettings.categories;
      const { [oldName]: deletedFormula, ...otherFormulas } = storeSettings.pricingFormulas;
      
      setStoreSettings(prev => ({
        ...prev,
        categories: {
          ...otherCategories,
          [newName]: categoryBrands
        },
        pricingFormulas: {
          ...otherFormulas,
          [newName]: categoryFormula
        }
      }));
    }
    setEditingCategory(null);
  };

  const handleAddBrand = (category: string) => {
    if (newBrandName.trim() && !storeSettings.categories[category].includes(newBrandName)) {
      setStoreSettings(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: [...prev.categories[category], newBrandName]
        }
      }));
      setNewBrandName('');
    }
  };

  const handleDeleteBrand = (category: string, brand: string) => {
    setStoreSettings(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: prev.categories[category].filter(b => b !== brand)
      }
    }));
  };

  const handleEditBrand = (category: string, oldBrand: string, newBrand: string) => {
    if (newBrand.trim() && newBrand !== oldBrand && !storeSettings.categories[category].includes(newBrand)) {
      setStoreSettings(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: prev.categories[category].map(b => b === oldBrand ? newBrand : b)
        }
      }));
    }
    setEditingBrand(null);
  };

  const handleAddListFieldValue = (field: string) => {
    if (newListFieldValue.trim() && !storeSettings[field].includes(newListFieldValue)) {
      setStoreSettings(prev => ({
        ...prev,
        [field]: [...prev[field], newListFieldValue]
      }));
      setNewListFieldValue('');
    }
  };

  const handleDeleteListFieldValue = (field: string, value: string) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: prev[field].filter(v => v !== value)
    }));
  };

  const handleEditListFieldValue = (field: string, oldValue: string, newValue: string) => {
    if (newValue.trim() && newValue !== oldValue && !storeSettings[field].includes(newValue)) {
      setStoreSettings(prev => ({
        ...prev,
        [field]: prev[field].map(v => v === oldValue ? newValue : v)
      }));
    }
    setEditingListField(null);
  };

  const handleUpdatePricingFormula = (category: string, field: string, value: number) => {
    setStoreSettings(prev => ({
      ...prev,
      pricingFormulas: {
        ...prev.pricingFormulas,
        [category]: {
          ...prev.pricingFormulas[category],
          [field]: value
        }
      }
    }));
  };

  const handleUpdateGeneralSetting = (field: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [field]: value
    }));
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
      totalCustomers: 1250, // Mock data
      pendingOrders: allOrders.filter(order => order.status === 'confirmed' || order.status === 'shipped').length,
      lowStockItems: Math.floor(products.length * 0.15) // Mock 15% low stock
    };
  };

  const stats = calculateStats();
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  // Mock sales data for charts
  const salesData: SalesData[] = [
    { month: 'Jan', sales: 4500000, orders: 145 },
    { month: 'Feb', sales: 5200000, orders: 167 },
    { month: 'Mar', sales: 4800000, orders: 156 },
    { month: 'Apr', sales: 6100000, orders: 198 },
    { month: 'May', sales: 5700000, orders: 189 },
    { month: 'Jun', sales: 6800000, orders: 221 },
    { month: 'Jul', sales: 7200000, orders: 234 },
    { month: 'Aug', sales: 8100000, orders: 267 }
  ];

  // Render list field management section
  const renderListFieldSection = (field: string, title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newListFieldValue}
            onChange={(e) => setNewListFieldValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            onKeyPress={(e) => e.key === 'Enter' && handleAddListFieldValue(field)}
          />
          <Button onClick={() => handleAddListFieldValue(field)}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {storeSettings[field]?.map((value: string, index: number) => (
            <div key={value} className="flex items-center justify-between p-2 border rounded">
              {editingListField?.field === field && editingListField?.value === value ? (
                <Input
                  defaultValue={value}
                  onBlur={(e) => handleEditListFieldValue(field, value, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditListFieldValue(field, value, e.currentTarget.value);
                    }
                  }}
                  className="text-sm"
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-sm">{value}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingListField({ field, value, index })}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {title}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{value}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteListFieldValue(field, value)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0e0e1f] dark:bg-card w-full pt-12 pb-4">
        <div className="relative h-[42px] flex items-center px-4">
          <button
            onClick={onBackToStore}
            className="absolute left-0 p-2"
          >
            <ArrowLeft className="w-5 h-5 text-white dark:text-foreground" />
          </button>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white dark:text-foreground font-medium">
            Admin Dashboard
          </h1>
          <button
            onClick={onBulkBuyer}
            className="absolute right-0 bg-purple-600 hover:bg-purple-700 transition-colors px-3 py-1.5 rounded text-white text-xs"
          >
            Bulk Buyer?
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-background border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStore}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <button
            onClick={onBulkBuyer}
            className="bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg text-white"
          >
            <Package className="w-4 h-4" />
            <span className="text-sm">Bulk Buyer?</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    <AlertTriangle className="inline h-3 w-3 mr-1" />
                    {stats.lowStockItems} low stock
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +5.4% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Store Settings</h2>
                <p className="text-muted-foreground">
                  Manage your store configuration, product categories, pricing formulas, and system settings.
                </p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Auto-saved
              </Button>
            </div>

            <Tabs value={activeSettingsTab} onValueChange={setActiveSettingsTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="categories">Categories & Brands</TabsTrigger>
                <TabsTrigger value="attributes">Product Attributes</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Commission</TabsTrigger>
                <TabsTrigger value="general">General Settings</TabsTrigger>
                <TabsTrigger value="content">Content Management</TabsTrigger>
              </TabsList>

              {/* Categories & Brands Tab */}
              <TabsContent value="categories" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Product Categories & Brands
                    </CardTitle>
                    <CardDescription>
                      Manage product categories and their associated brands. Each category has its own pricing formula.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Add new category */}
                    <div className="flex gap-2 mb-6">
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Add new category"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button onClick={handleAddCategory}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                      </Button>
                    </div>

                    {/* Categories list */}
                    <div className="space-y-4">
                      {Object.entries(storeSettings.categories).map(([category, brands]) => (
                        <Card key={category} className="border-2">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              {editingCategory === category ? (
                                <Input
                                  defaultValue={category}
                                  onBlur={(e) => handleEditCategory(category, e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditCategory(category, e.currentTarget.value);
                                    }
                                  }}
                                  className="font-medium text-lg"
                                  autoFocus
                                />
                              ) : (
                                <h3 className="font-medium text-lg flex items-center gap-2">
                                  {category}
                                  <Badge variant="secondary">{brands.length} brands</Badge>
                                </h3>
                              )}
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingCategory(category)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{category}" and all its brands? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteCategory(category)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Add new brand */}
                            <div className="flex gap-2 mb-3">
                              <Input
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder={`Add brand to ${category}`}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddBrand(category)}
                              />
                              <Button size="sm" onClick={() => handleAddBrand(category)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Brands list */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {brands.map((brand) => (
                                <div key={brand} className="flex items-center justify-between p-2 border rounded">
                                  {editingBrand?.category === category && editingBrand?.brand === brand ? (
                                    <Input
                                      defaultValue={brand}
                                      onBlur={(e) => handleEditBrand(category, brand, e.target.value)}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleEditBrand(category, brand, e.currentTarget.value);
                                        }
                                      }}
                                      className="text-sm"
                                      autoFocus
                                    />
                                  ) : (
                                    <>
                                      <span className="text-sm">{brand}</span>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setEditingBrand({ category, brand })}
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="ghost">
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete "{brand}" from {category}? This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={() => handleDeleteBrand(category, brand)}>
                                                Delete
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Product Attributes Tab */}
              <TabsContent value="attributes" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderListFieldSection('conditions', 'Product Conditions', 'Manage available product conditions for categorizing inventory.')}
                  {renderListFieldSection('storage', 'Storage Options', 'Define storage capacity options for devices.')}
                  {renderListFieldSection('memory', 'Memory/RAM Options', 'Configure memory/RAM capacity options.')}
                  {renderListFieldSection('graphicsMemory', 'Graphics Memory', 'Set graphics card memory options for laptops.')}
                  {renderListFieldSection('warranty', 'Warranty Periods', 'Configure warranty duration options.')}
                </div>
              </TabsContent>

              {/* Pricing & Commission Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Pricing Formulas & Commission Structure
                    </CardTitle>
                    <CardDescription>
                      Configure pricing calculations and commission rates for each product category.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(storeSettings.pricingFormulas).map(([category, formula]) => (
                        <Card key={category} className="border-2">
                          <CardHeader>
                            <CardTitle className="text-lg">{category}</CardTitle>
                            <CardDescription>
                              Formula: (Supplier Price + ₦{formula.addition}) × {formula.multiplier} = Store Price
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`addition-${category}`}>Addition (₦)</Label>
                                <Input
                                  id={`addition-${category}`}
                                  type="number"
                                  value={formula.addition}
                                  onChange={(e) => handleUpdatePricingFormula(category, 'addition', parseInt(e.target.value) || 0)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Amount added to supplier price</p>
                              </div>
                              <div>
                                <Label htmlFor={`multiplier-${category}`}>Multiplier</Label>
                                <Input
                                  id={`multiplier-${category}`}
                                  type="number"
                                  value={formula.multiplier}
                                  onChange={(e) => handleUpdatePricingFormula(category, 'multiplier', parseFloat(e.target.value) || 0)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Exchange rate multiplier</p>
                              </div>
                              <div>
                                <Label htmlFor={`commission-${category}`}>Commission (₦)</Label>
                                <Input
                                  id={`commission-${category}`}
                                  type="number"
                                  value={formula.commission}
                                  onChange={(e) => handleUpdatePricingFormula(category, 'commission', parseInt(e.target.value) || 0)}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Affiliate commission per item</p>
                              </div>
                            </div>
                            
                            {/* Formula preview */}
                            <div className="mt-4 p-4 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Formula Preview</h4>
                              <p className="text-sm text-muted-foreground">
                                Example: Supplier price ¥1000 → (¥1000 + ₦{formula.addition}) × {formula.multiplier} = ₦{((1000 + formula.addition) * formula.multiplier).toLocaleString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Commission: ₦{formula.commission.toLocaleString()} per item
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* General Settings Tab */}
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Store Information
                      </CardTitle>
                      <CardDescription>
                        Basic store configuration and branding settings.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                          id="storeName"
                          value={storeSettings.storeName}
                          onChange={(e) => handleUpdateGeneralSetting('storeName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={storeSettings.currency}
                          onValueChange={(value) => handleUpdateGeneralSetting('currency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deliveryTime">Delivery Time (Business Days)</Label>
                        <Input
                          id="deliveryTime"
                          type="number"
                          value={storeSettings.deliveryTime}
                          onChange={(e) => handleUpdateGeneralSetting('deliveryTime', parseInt(e.target.value) || 10)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Expected delivery time from China</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Operational Settings
                      </CardTitle>
                      <CardDescription>
                        Configure operational aspects of your store.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Auto-calculate prices</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch defaultChecked />
                          <span className="text-sm text-muted-foreground">
                            Automatically calculate store prices using formulas
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label>Email notifications</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch defaultChecked />
                          <span className="text-sm text-muted-foreground">
                            Send email notifications for new orders
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label>Inventory tracking</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch />
                          <span className="text-sm text-muted-foreground">
                            Track inventory levels (coming soon)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Content Management Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Store Content
                    </CardTitle>
                    <CardDescription>
                      Manage store description and default content templates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="storeDescription">Store Description</Label>
                      <Textarea
                        id="storeDescription"
                        value={storeSettings.storeDescription}
                        onChange={(e) => handleUpdateGeneralSetting('storeDescription', e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This appears on your store homepage and marketing materials
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="paySmallSmallDefault">Default Pay Small Small Content</Label>
                      <Textarea
                        id="paySmallSmallDefault"
                        value={storeSettings.paySmallSmallDefault}
                        onChange={(e) => handleUpdateGeneralSetting('paySmallSmallDefault', e.target.value)}
                        rows={6}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Default content for Pay Small Small payment option description
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Products Tab - Placeholder */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Product management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab - Placeholder */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Order management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab - Placeholder */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View customer analytics and information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Customer management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab - Placeholder */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed business insights and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Advanced analytics interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <BulkOrderCreateDialog
        isOpen={isCreatingBulkOrder}
        onClose={() => setIsCreatingBulkOrder(false)}
        products={products}
        onCreateOrder={onBulkOrderCreate}
      />

      <ReturnsOrderCreateDialog
        isOpen={isCreatingReturnsOrder}
        onClose={() => setIsCreatingReturnsOrder(false)}
        products={products}
        orders={orders}
        onCreateOrder={onReturnsOrderCreate}
      />
    </div>
  );
}