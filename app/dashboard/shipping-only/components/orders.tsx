'use client';

import React, { useEffect, useState } from 'react';
import OrderCard from '@/app/dashboard/shipping-only/components/OrderCardShippingOnly';

interface Order {
  serialNumber: number;
  id: number;
  pidShippingOnly: string;
  pidUser: string;
  whatsappNumber: string;
  shippingName: string;
  shippingTo: string;
  grossWeight: string;
  trackingNumber: string;
  shippingPlan: string;
  expectedShipments: string;
  wantProductVerification: string;
  wantConsolidation: string;
  multipleSuppliers: string;
  description: string;
  status: string;
  createdAt: string;
  invoices?: Array<{
    pidPayment: string;
    pidInvoice?: string;
    amount?: string;
    currency_type?: string;
    payment_status?: string;
    payment_type?: string;
    invoiceNumber?: string;
    accessToken?: string | null;
    source?: string;
    createdAt?: string | null;
    issuedAt?: string | null;
  }>;
}

interface PaymentSectionProps {
  initialOrders: Order[];
  statusx: string;
}

function Orders({ initialOrders }: PaymentSectionProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  //CONVERT RECORDS TO ARRAY
  const orderArray = Object.values(orders);

  //alert(orderArray.length);
  //special update
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Shipping Requests
          </h2>
        </div>

        <div className="flex w-full flex-col gap-4">
        {orderArray.map((order, index) => {
          const serialNumber = index + 1; // Auto-incrementing serial number
          return (
            <OrderCard
              serialNumber={serialNumber}
              key={`${order.id}-${order.pidShippingOnly}-${index}`}
              id={order.id}
              pidShippingOnly={order.pidShippingOnly}
              pidUser={order.pidUser}
              whatsappNumber={order.whatsappNumber}
              shippingName={order.shippingName}
              shippingTo={order.shippingTo}
              grossWeight={order.grossWeight}
              trackingNumber={order.trackingNumber}
              shippingPlan={order.shippingPlan}
              expectedShipments={order.expectedShipments}
              wantProductVerification={order.wantProductVerification}
              wantConsolidation={order.wantConsolidation}
              multipleSuppliers={order.multipleSuppliers}
              description={order.description}
              status={order.status}
              createdAt={order.createdAt}
              invoices={order.invoices}
              onDelete={handleDelete}
            />
          );
        })}
        </div>
      </div>

      {/* <div className="flex w-full flex-col gap-3">
        {Array.isArray(orderArray) && orderArray.length > 0 ? (
          orderArray.map((order, index) => {
            const serialNumber = index + 1;
            return (
              <OrderCard
              serialNumber={serialNumber}
              key={index}
              id={order.id}
              pidShippingOnly={order.pidShippingOnly}
              pidUser={order.pidUser}
              whatsappNumber={order.whatsappNumber}
              shippingName={order.shippingName}
              shippingTo={order.shippingTo}
              grossWeight={order.grossWeight}
              trackingNumber={order.trackingNumber}
              shippingPlan={order.shippingPlan}
              expectedShipments={order.expectedShipments}
              wantProductVerification={order.wantProductVerification}
              wantConsolidation={order.wantConsolidation}
              multipleSuppliers={order.multipleSuppliers}
              description={order.pidUser}
              status={order.status}
              createdAt={order.createdAt}
              />
            );
          })
        ) : (
          <p>No orders available.</p>
        )}
      </div> */}
    </>
  );
}

export default Orders;
