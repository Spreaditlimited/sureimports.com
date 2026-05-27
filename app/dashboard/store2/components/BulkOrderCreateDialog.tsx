// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  Plus,
  Trash2,
  Calculator,
  User,
  Package,
  CheckCircle,
  X,
} from 'lucide-react';
import { Product, BulkOrder, BulkOrderItem } from './App';
import { useEffect } from 'react';

interface BulkOrderCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCreateBulkOrder: (bulkOrder: BulkOrder) => void;
}

// Success Dialog Component
function BulkOrderSuccessDialog({
  isOpen,
  onClose,
  orderNumber,
  totalItems,
  totalCommission,
  totalAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalItems: number;
  totalCommission: number;
  totalAmount: number;
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl">
            Bulk Order Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Your bulk order has been created and added to the order tracking
            system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-1">
                <p>
                  <strong>Order Number:</strong> {orderNumber}
                </p>
                <p>
                  <strong>Total Items:</strong> {totalItems} products
                </p>
                <p>
                  <strong>Total Amount:</strong> {formatCurrency(totalAmount)}
                </p>
                <p>
                  <strong>Commission Earned:</strong>{' '}
                  {formatCurrency(totalCommission)}
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <p className="text-center text-sm text-muted-foreground">
            The order has been added to the upcoming orders tab and customers
            will receive tracking information.
          </p>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BulkOrderCreateDialog({
  isOpen,
  onClose,
  products,
  onCreateBulkOrder,
}: BulkOrderCreateDialogProps) {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<BulkOrder | null>(
    null,
  );

  const calculateCommission = (category: string, quantity: number): number => {
    if (
      category === 'Laptops' ||
      category === 'Phones' ||
      category === 'Tablets'
    ) {
      return 5000 * quantity; // ₦5,000 per unit for laptops, phones, and tablets
    }
    return 0; // No commission for accessories in bulk orders
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  const addItemToOrder = () => {
    if (!selectedProductId || quantity <= 0) return;

    const product = products.find((p) => p.id === parseInt(selectedProductId));
    if (!product) return;

    const unitPrice = customPrice
      ? parseFloat(customPrice)
      : parseFloat(product.price.replace(/[₦,]/g, ''));
    const totalPrice = unitPrice * quantity;
    const commission = calculateCommission(product.category, quantity);

    const newItem: BulkOrderItem = {
      productId: product.id,
      productName: product.title,
      category: product.category,
      quantity,
      unitPrice,
      totalPrice,
      affiliateCommission: commission,
    };

    setOrderItems((prev) => [...prev, newItem]);
    setSelectedProductId('');
    setQuantity(1);
    setCustomPrice('');
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  const totalCommission = orderItems.reduce(
    (sum, item) => sum + item.affiliateCommission,
    0,
  );

  const handleCreateOrder = () => {
    if (
      !customerDetails.name ||
      !customerDetails.email ||
      !customerDetails.phone ||
      orderItems.length === 0
    ) {
      alert('Please fill in all customer details and add at least one item.');
      return;
    }

    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date()
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, ' - ');

    // Calculate expected delivery (10 business days from now)
    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 14); // Adding 14 calendar days for 10 business days
    const expectedDelivery = expectedDeliveryDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, ' - ');

    const bulkOrder: BulkOrder = {
      id: `bulk-${Date.now()}`,
      orderNumber,
      customerDetails,
      items: orderItems,
      totalAmount,
      totalCommission,
      status: 'confirmed',
      orderDate,
      expectedDelivery,
      notes: notes || undefined,
    };

    // Store the created order for success dialog
    setLastCreatedOrder(bulkOrder);

    // Call the parent callback to add to orders
    onCreateBulkOrder(bulkOrder);

    // Reset form
    setCustomerDetails({ name: '', email: '', phone: '', address: '' });
    setOrderItems([]);
    setNotes('');
    setActiveTab('customer');

    // Close main dialog and show success dialog
    onClose();
    setShowSuccessDialog(true);
  };

  const isFormValid =
    customerDetails.name &&
    customerDetails.email &&
    customerDetails.phone &&
    orderItems.length > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[85vh] max-w-5xl flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <DialogTitle className="text-xl">Create Bulk Order</DialogTitle>
            <DialogDescription>
              Create a bulk order for customers who have already paid
              off-platform
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-full w-full flex-col"
            >
              <TabsList className="grid w-full flex-shrink-0 grid-cols-3">
                <TabsTrigger
                  value="customer"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Customer Details
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Add Products
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Order Summary
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-2">
                <TabsContent value="customer" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                      <CardDescription>
                        Enter the customer's details for order tracking and
                        delivery
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name">Full Name *</Label>
                          <Input
                            id="customer-name"
                            value={customerDetails.name}
                            onChange={(e) =>
                              setCustomerDetails((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-email">
                            Email Address *
                          </Label>
                          <Input
                            id="customer-email"
                            type="email"
                            value={customerDetails.email}
                            onChange={(e) =>
                              setCustomerDetails((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-phone">Phone Number *</Label>
                          <Input
                            id="customer-phone"
                            value={customerDetails.phone}
                            onChange={(e) =>
                              setCustomerDetails((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+234 800 000 0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-address">
                            Delivery Address
                          </Label>
                          <Input
                            id="customer-address"
                            value={customerDetails.address}
                            onChange={(e) =>
                              setCustomerDetails((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            placeholder="123 Lagos Street, Victoria Island"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setActiveTab('products')}
                      disabled={
                        !customerDetails.name ||
                        !customerDetails.email ||
                        !customerDetails.phone
                      }
                    >
                      Next: Add Products
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Products to Order</CardTitle>
                      <CardDescription>
                        Select products and quantities for this bulk order
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Product Selection - Better responsive layout */}
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Product *</Label>
                            <Select
                              value={selectedProductId}
                              onValueChange={setSelectedProductId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id.toString()}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {product.title}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {product.category} • {product.price}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Quantity *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  setQuantity(parseInt(e.target.value) || 1)
                                }
                                placeholder="1"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Custom Price (₦)</Label>
                              <Input
                                type="number"
                                placeholder="Optional custom price"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {selectedProductId &&
                            (() => {
                              const product = products.find(
                                (p) => p.id === parseInt(selectedProductId),
                              );
                              if (product) {
                                const unitPrice = customPrice
                                  ? parseFloat(customPrice)
                                  : parseFloat(
                                      product.price.replace(/[₦,]/g, ''),
                                    );
                                const totalPrice = unitPrice * quantity;
                                const commission = calculateCommission(
                                  product.category,
                                  quantity,
                                );

                                return (
                                  <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                                    <h4 className="font-medium">
                                      Price Calculation
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Unit Price:</span>
                                        <span className="font-medium">
                                          {formatCurrency(unitPrice)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Quantity:</span>
                                        <span className="font-medium">
                                          {quantity} units
                                        </span>
                                      </div>
                                      <div className="flex justify-between border-t pt-2">
                                        <span>Total Price:</span>
                                        <span className="font-medium">
                                          {formatCurrency(totalPrice)}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-green-600">
                                        <span>Commission:</span>
                                        <span className="font-medium">
                                          {formatCurrency(commission)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })()}

                          <Button
                            onClick={addItemToOrder}
                            disabled={!selectedProductId || quantity <= 0}
                            className="w-full"
                            size="lg"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {orderItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Items ({orderItems.length})</CardTitle>
                        <CardDescription>
                          Review and manage products in this bulk order
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Mobile-friendly card layout for smaller screens */}
                        <div className="block space-y-3 lg:hidden">
                          {orderItems.map((item, index) => (
                            <div
                              key={index}
                              className="space-y-3 rounded-lg border p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm font-medium leading-tight">
                                    {item.productName}
                                  </h4>
                                  <Badge variant="outline" className="mt-1">
                                    {item.category}
                                  </Badge>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeItem(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    Quantity
                                  </p>
                                  <p className="font-medium">
                                    {item.quantity} units
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Unit Price
                                  </p>
                                  <p className="font-medium">
                                    {formatCurrency(item.unitPrice)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Total Price
                                  </p>
                                  <p className="font-medium">
                                    {formatCurrency(item.totalPrice)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    Commission
                                  </p>
                                  <p className="font-medium text-green-600">
                                    {formatCurrency(item.affiliateCommission)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop table layout */}
                        <div className="hidden overflow-x-auto lg:block">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Commission</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {orderItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="max-w-[200px] font-medium">
                                    <div
                                      className="truncate"
                                      title={item.productName}
                                    >
                                      {item.productName}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {item.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    {formatCurrency(item.unitPrice)}
                                  </TableCell>
                                  <TableCell>
                                    {formatCurrency(item.totalPrice)}
                                  </TableCell>
                                  <TableCell className="text-green-600">
                                    {formatCurrency(item.affiliateCommission)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeItem(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Summary section */}
                        <div className="mt-4 rounded-lg bg-muted/50 p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
                            <div>
                              <p className="text-muted-foreground">
                                Total Items
                              </p>
                              <p className="font-medium">
                                {orderItems.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0,
                                )}{' '}
                                units
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Total Amount
                              </p>
                              <p className="font-medium">
                                {formatCurrency(totalAmount)}
                              </p>
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                              <p className="text-muted-foreground">
                                Total Commission
                              </p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(totalCommission)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('customer')}
                    >
                      Back: Customer Details
                    </Button>
                    <Button
                      onClick={() => setActiveTab('summary')}
                      disabled={orderItems.length === 0}
                    >
                      Next: Review Order
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="break-words font-medium">
                            {customerDetails.name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="break-all text-sm font-medium leading-relaxed">
                            {customerDetails.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="break-words font-medium">
                            {customerDetails.phone}
                          </p>
                        </div>
                        {customerDetails.address && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p className="break-words font-medium leading-relaxed">
                              {customerDetails.address}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Total Items:
                          </span>
                          <span className="font-medium">
                            {orderItems.reduce(
                              (sum, item) => sum + item.quantity,
                              0,
                            )}{' '}
                            units
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Total Amount:
                          </span>
                          <span className="break-words text-right font-medium">
                            {formatCurrency(totalAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-green-600">
                            Total Commission:
                          </span>
                          <span className="break-words text-right font-medium text-green-600">
                            {formatCurrency(totalCommission)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Items</CardTitle>
                      <CardDescription>
                        Review all products included in this bulk order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Mobile-friendly layout for smaller screens */}
                      <div className="block space-y-4 lg:hidden">
                        {orderItems.map((item, index) => (
                          <div
                            key={index}
                            className="space-y-3 rounded-lg border p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="break-words text-sm font-medium leading-tight">
                                  {item.productName}
                                </h4>
                                <Badge variant="outline" className="mt-1">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-muted-foreground">
                                  Quantity
                                </p>
                                <p className="font-medium">
                                  {item.quantity} units
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Unit Price
                                </p>
                                <p className="break-words font-medium">
                                  {formatCurrency(item.unitPrice)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Total Price
                                </p>
                                <p className="break-words font-medium">
                                  {formatCurrency(item.totalPrice)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Commission
                                </p>
                                <p className="break-words font-medium text-green-600">
                                  {formatCurrency(item.affiliateCommission)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop table layout */}
                      <div className="hidden overflow-x-auto lg:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[200px]">
                                Product
                              </TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Unit Price</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Commission</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell className="max-w-[200px] font-medium">
                                  <div
                                    className="break-words leading-tight"
                                    title={item.productName}
                                  >
                                    {item.productName}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {item.category}
                                  </Badge>
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="break-words">
                                  {formatCurrency(item.unitPrice)}
                                </TableCell>
                                <TableCell className="break-words">
                                  {formatCurrency(item.totalPrice)}
                                </TableCell>
                                <TableCell className="break-words text-green-600">
                                  {formatCurrency(item.affiliateCommission)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Notes</CardTitle>
                      <CardDescription>
                        Add any special instructions or comments for this bulk
                        order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions or notes for this order..."
                        rows={4}
                        className="resize-none"
                      />
                      {notes && (
                        <div className="mt-3 rounded-lg bg-muted/50 p-3">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Preview:
                          </p>
                          <p className="break-words text-sm leading-relaxed">
                            {notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('products')}
                    >
                      Back: Products
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateOrder}
                        disabled={!isFormValid}
                      >
                        Create Bulk Order
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      {lastCreatedOrder && (
        <BulkOrderSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          orderNumber={lastCreatedOrder.orderNumber}
          totalItems={lastCreatedOrder.items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          )}
          totalCommission={lastCreatedOrder.totalCommission}
          totalAmount={lastCreatedOrder.totalAmount}
        />
      )}
    </>
  );
}
