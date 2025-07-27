'use client';

import React, { useState } from 'react';
import OrderCard from '@/app/dashboard/pay-supplier/components/OrderCardPaySupplier';

interface Order {
  serialNumber: number;
  id: number;
  pidPaySupplier: string;
  pidUser: string;
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  aliPayAccountQRCodeImage: string;
  weChatAccountQRCodeImage: string;
  proformaInvoiceImage: string;
  supplierBankAccountDetails: string;
  amountToPayInYuan: string;
  amountToPayInNaira: string;
  serviceCharge: string;
  status: string;
  createdAt: string;
}

interface PaymentSectionProps {
  initialOrders: Order[];
  statusx: string;
}

function Orders({ initialOrders }: PaymentSectionProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  //alert(orders);
  //special update
  return (
    <>
      <div className="flex w-full flex-col gap-3">
        {orders.map((order, index) => {
          const serialNumber = index + 1; // Auto-incrementing serial number
          return (
            <OrderCard
              serialNumber={serialNumber}
              key={index}
              id={order.id}
              pidUser={order.pidUser}
              pidPaySupplier={order.pidPaySupplier}
              supplierName={order.supplierName}
              supplierPhone={order.supplierPhone}
              supplierEmail={order.supplierEmail}
              aliPayAccountQRCodeImage={order.aliPayAccountQRCodeImage}
              weChatAccountQRCodeImage={order.weChatAccountQRCodeImage}
              proformaInvoiceImage={order.proformaInvoiceImage}
              supplierBankAccountDetails={order.supplierBankAccountDetails}
              amountToPayInYuan={order.amountToPayInYuan}
              amountToPayInNaira={order.amountToPayInNaira}
              serviceCharge={order.serviceCharge}
              status={order.status}
              createdAt={order.createdAt}
            />
          );
        })}
      </div>
    </>
  );
}

export default Orders;
