"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, AlertTriangle, CheckCircle, X, RotateCcw, Truck } from "lucide-react";
import { Product, Order } from "../App";

interface ReturnsOrderCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onCreateReturnsOrder: (returnOrder: ReturnsOrder) => void;
}

export interface ReturnsOrder {
  id: string;
  orderNumber: string;
  originalOrderNumber?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  returnedProduct: {
    productId: number;
    productName: string;
    category: string;
    quantity: number;
    originalPrice: number;
    returnReason: string;
    returnType: 'replacement' | 'repair';
    condition: string;
    images?: string[];
  };
  shippingDetails: {
    courierService: string;
    trackingNumber?: string;
    shippingCost: number;
    insuranceValue: number;
  };
  status: 'confirmed' | 'shipped' | 'arrived' | 'replaced' | 'shipped-back' | 'arrived-back' | 'delivered';
  orderDate: string;
  expectedDelivery: string;
  notes?: string;
  estimatedProcessingTime: string;
}

// Success Dialog Component
function ReturnsOrderSuccessDialog({ 
  isOpen, 
  onClose, 
  orderNumber, 
  returnType,
  customerName,
  productName,
  estimatedProcessingTime
}: {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  returnType: string;
  customerName: string;
  productName: string;
  estimatedProcessingTime: string;
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl">Returns Order Created Successfully!</DialogTitle>
          <DialogDescription>
            The returns order has been created and shipping to China has been initiated.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-1">
                <p><strong>Returns Order Number:</strong> {orderNumber}</p>
                <p><strong>Customer:</strong> {customerName}</p>
                <p><strong>Product:</strong> {productName}</p>
                <p><strong>Return Type:</strong> {returnType === 'replacement' ? 'Replacement' : 'Repair'}</p>
                <p><strong>Processing Time:</strong> {estimatedProcessingTime}</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground text-center">
            The product will be shipped to our facility in China for {returnType === 'replacement' ? 'replacement' : 'repair'}. 
            The customer will receive tracking updates throughout the process.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReturnsOrderCreateDialog({
  isOpen,
  onClose,
  products,
  onCreateReturnsOrder
}: ReturnsOrderCreateDialogProps) {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [returnDetails, setReturnDetails] = useState({
    originalOrderNumber: '',
    selectedProductId: '',
    quantity: 1,
    returnReason: '',
    returnType: 'replacement' as 'replacement' | 'repair',
    condition: '',
    courierService: '',
    trackingNumber: '',
    shippingCost: 0,
    insuranceValue: 0
  });
  
  const [notes, setNotes] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<ReturnsOrder | null>(null);

  const returnReasons = [
    'Defective/Not working',
    'Wrong product received',
    'Damaged during shipping',
    'Does not match description',
    'Performance issues',
    'Screen damage',
    'Battery issues',
    'Software problems',
    'Hardware malfunction',
    'Other'
  ];

  const courierServices = [
    'DHL Express',
    'FedEx International',
    'UPS Worldwide Express',
    'EMS Express',
    'China Post'
  ];

  const productConditions = [
    'Like new - minimal use',
    'Good - normal wear',
    'Fair - visible wear',
    'Poor - significant damage',
    'Not functional'
  ];

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}.00`;
  };

  const calculateProcessingTime = (returnType: 'replacement' | 'repair', productCategory: string) => {
    if (returnType === 'replacement') {
      return '14-21 business days';
    } else {
      // Repair times vary by category
      switch (productCategory) {
        case 'Phones':
          return '10-15 business days';
        case 'Laptops':
          return '15-25 business days';
        case 'Tablets':
          return '12-18 business days';
        default:
          return '10-20 business days';
      }
    }
  };

  const handleCreateReturnsOrder = () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || 
        !returnDetails.selectedProductId || !returnDetails.returnReason || !returnDetails.courierService) {
      alert('Please fill in all required fields.');
      return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(returnDetails.selectedProductId));
    if (!selectedProduct) {
      alert('Selected product not found.');
      return;
    }

    const orderNumber = `#R${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' - ');

    // Calculate expected delivery based on processing time
    const processingTime = calculateProcessingTime(returnDetails.returnType, selectedProduct.category);
    const expectedDeliveryDate = new Date();
    const daysToAdd = returnDetails.returnType === 'replacement' ? 28 : 35; // Account for full round trip
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + daysToAdd);
    const expectedDelivery = expectedDeliveryDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' - ');

    const returnsOrder: ReturnsOrder = {
      id: `return-${Date.now()}`,
      orderNumber,
      originalOrderNumber: returnDetails.originalOrderNumber || undefined,
      customerDetails,
      returnedProduct: {
        productId: selectedProduct.id,
        productName: selectedProduct.title,
        category: selectedProduct.category,
        quantity: returnDetails.quantity,
        originalPrice: parseFloat(selectedProduct.price.replace(/[₦,]/g, '')),
        returnReason: returnDetails.returnReason,
        returnType: returnDetails.returnType,
        condition: returnDetails.condition
      },
      shippingDetails: {
        courierService: returnDetails.courierService,
        trackingNumber: returnDetails.trackingNumber || undefined,
        shippingCost: returnDetails.shippingCost,
        insuranceValue: returnDetails.insuranceValue
      },
      status: 'confirmed',
      orderDate,
      expectedDelivery,
      notes: notes || undefined,
      estimatedProcessingTime: processingTime
    };

    // Store the created order for success dialog
    setLastCreatedOrder(returnsOrder);
    
    // Call the parent callback to add to orders
    onCreateReturnsOrder(returnsOrder);
    
    // Reset form
    setCustomerDetails({ name: '', email: '', phone: '', address: '' });
    setReturnDetails({
      originalOrderNumber: '',
      selectedProductId: '',
      quantity: 1,
      returnReason: '',
      returnType: 'replacement',
      condition: '',
      courierService: '',
      trackingNumber: '',
      shippingCost: 0,
      insuranceValue: 0
    });
    setNotes('');
    setActiveTab('customer');
    
    // Close main dialog and show success dialog
    onClose();
    setShowSuccessDialog(true);
  };

  const isFormValid = customerDetails.name && customerDetails.email && customerDetails.phone && 
                     returnDetails.selectedProductId && returnDetails.returnReason && returnDetails.courierService;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle className="text-xl flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-500" />
              Create Returns Order
            </DialogTitle>
            <DialogDescription>
              Create a returns order for products that need to be shipped back to China for replacement or repair
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Customer & Product
                </TabsTrigger>
                <TabsTrigger value="return" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Return Details
                </TabsTrigger>
                <TabsTrigger value="shipping" className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Shipping & Summary
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-2">

                <TabsContent value="customer" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                      <CardDescription>
                        Enter the customer's details for the returns process
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name">Full Name *</Label>
                          <Input
                            id="customer-name"
                            value={customerDetails.name}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Customer full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-email">Email Address *</Label>
                          <Input
                            id="customer-email"
                            type="email"
                            value={customerDetails.email}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="customer@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-phone">Phone Number *</Label>
                          <Input
                            id="customer-phone"
                            value={customerDetails.phone}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+234 800 000 0000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-address">Return Address</Label>
                          <Input
                            id="customer-address"
                            value={customerDetails.address}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Where to collect the product"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Selection</CardTitle>
                      <CardDescription>
                        Select the product that needs to be returned to China
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Original Order Number (Optional)</Label>
                          <Input
                            value={returnDetails.originalOrderNumber}
                            onChange={(e) => setReturnDetails(prev => ({ ...prev, originalOrderNumber: e.target.value }))}
                            placeholder="#1234 (if available)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={returnDetails.quantity}
                            onChange={(e) => setReturnDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Product to Return *</Label>
                        <Select 
                          value={returnDetails.selectedProductId} 
                          onValueChange={(value) => setReturnDetails(prev => ({ ...prev, selectedProductId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select the product to return" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{product.title}</span>
                                  <span className="text-xs text-muted-foreground">{product.category} • {product.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setActiveTab('return')} 
                      disabled={!customerDetails.name || !customerDetails.email || !customerDetails.phone || !returnDetails.selectedProductId}
                    >
                      Next: Return Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="return" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Return Information</CardTitle>
                      <CardDescription>
                        Provide details about why the product is being returned
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Return Reason *</Label>
                          <Select 
                            value={returnDetails.returnReason} 
                            onValueChange={(value) => setReturnDetails(prev => ({ ...prev, returnReason: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select return reason" />
                            </SelectTrigger>
                            <SelectContent>
                              {returnReasons.map((reason) => (
                                <SelectItem key={reason} value={reason}>
                                  {reason}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Return Type *</Label>
                          <Select 
                            value={returnDetails.returnType} 
                            onValueChange={(value: 'replacement' | 'repair') => setReturnDetails(prev => ({ ...prev, returnType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="replacement">Replacement</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Product Condition</Label>
                        <Select 
                          value={returnDetails.condition} 
                          onValueChange={(value) => setReturnDetails(prev => ({ ...prev, condition: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Describe current condition" />
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

                      {returnDetails.selectedProductId && (() => {
                        const product = products.find(p => p.id === parseInt(returnDetails.selectedProductId));
                        if (product) {
                          const processingTime = calculateProcessingTime(returnDetails.returnType, product.category);
                          
                          return (
                            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                              <AlertTriangle className="w-4 h-4 text-blue-600" />
                              <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <div className="space-y-1">
                                  <p><strong>Selected Product:</strong> {product.title}</p>
                                  <p><strong>Category:</strong> {product.category}</p>
                                  <p><strong>Original Price:</strong> {product.price}</p>
                                  <p><strong>Return Type:</strong> {returnDetails.returnType === 'replacement' ? 'Replacement' : 'Repair'}</p>
                                  <p><strong>Estimated Processing Time:</strong> {processingTime}</p>
                                </div>
                              </AlertDescription>
                            </Alert>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('customer')}>
                      Back: Customer Details
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('shipping')} 
                      disabled={!returnDetails.returnReason}
                    >
                      Next: Shipping Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="space-y-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping to China</CardTitle>
                      <CardDescription>
                        Configure shipping details for sending the product to our facility in China
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Courier Service *</Label>
                          <Select 
                            value={returnDetails.courierService} 
                            onValueChange={(value) => setReturnDetails(prev => ({ ...prev, courierService: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select courier service" />
                            </SelectTrigger>
                            <SelectContent>
                              {courierServices.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tracking Number (Optional)</Label>
                          <Input
                            value={returnDetails.trackingNumber}
                            onChange={(e) => setReturnDetails(prev => ({ ...prev, trackingNumber: e.target.value }))}
                            placeholder="Enter if already shipped"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Shipping Cost (₦)</Label>
                          <Input
                            type="number"
                            value={returnDetails.shippingCost}
                            onChange={(e) => setReturnDetails(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) || 0 }))}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Insurance Value (₦)</Label>
                          <Input
                            type="number"
                            value={returnDetails.insuranceValue}
                            onChange={(e) => setReturnDetails(prev => ({ ...prev, insuranceValue: parseFloat(e.target.value) || 0 }))}
                            placeholder="Product value for insurance"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Notes</CardTitle>
                      <CardDescription>
                        Any additional information about this return
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special instructions, condition details, customer requests, etc."
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{customerDetails.name}</p>
                          <p className="text-sm text-muted-foreground">{customerDetails.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contact</p>
                          <p className="font-medium">{customerDetails.phone}</p>
                          {customerDetails.address && (
                            <p className="text-sm text-muted-foreground">{customerDetails.address}</p>
                          )}
                        </div>
                      </div>
                      
                      {returnDetails.selectedProductId && (() => {
                        const product = products.find(p => p.id === parseInt(returnDetails.selectedProductId));
                        if (product) {
                          return (
                            <div className="pt-3 border-t">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-muted-foreground">Product</p>
                                  <p className="font-medium">{product.title}</p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">{product.category}</Badge>
                                    <Badge variant={returnDetails.returnType === 'replacement' ? 'default' : 'secondary'}>
                                      {returnDetails.returnType === 'replacement' ? 'Replacement' : 'Repair'}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Quantity</p>
                                  <p className="font-medium">{returnDetails.quantity}</p>
                                </div>
                              </div>
                              <div className="mt-3 text-sm">
                                <p><strong>Reason:</strong> {returnDetails.returnReason}</p>
                                {returnDetails.condition && (
                                  <p><strong>Condition:</strong> {returnDetails.condition}</p>
                                )}
                                <p><strong>Courier:</strong> {returnDetails.courierService}</p>
                                {returnDetails.shippingCost > 0 && (
                                  <p><strong>Shipping Cost:</strong> {formatCurrency(returnDetails.shippingCost)}</p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('return')}>
                      Back: Return Details
                    </Button>
                    <Button 
                      onClick={handleCreateReturnsOrder}
                      disabled={!isFormValid}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Create Returns Order
                    </Button>
                  </div>
                </TabsContent>

              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      {lastCreatedOrder && (
        <ReturnsOrderSuccessDialog
          isOpen={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          orderNumber={lastCreatedOrder.orderNumber}
          returnType={lastCreatedOrder.returnedProduct.returnType}
          customerName={lastCreatedOrder.customerDetails.name}
          productName={lastCreatedOrder.returnedProduct.productName}
          estimatedProcessingTime={lastCreatedOrder.estimatedProcessingTime}
        />
      )}
    </>
  );
}