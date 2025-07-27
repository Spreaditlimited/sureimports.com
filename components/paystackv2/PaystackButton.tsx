// components/PaystackButton.tsx
'use client';

import randomGenerator from '@/lib/helpers/randomGenerator';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PaystackButtonProps {
  title: string;
  email: string;
  amount: number;
  pidUser: string;
  pidProduct: string;
  productPrice: number;
  productName: string;
  quantity: number;
  currency: string;
  serviceID: string;
  serviceName: string;
  serviceDescription: string;
  publicKey: string;
  activeTab: string;
  purchaseType: string;
  fullName: string;
  phone: string;
  address: string;
  deliveryOption: string;
  deliveryLocation: string;
  metadata?: Record<string, any>;
  disabled?: boolean;
  children: React.ReactNode;
}

export const PaystackButton = ({
  email,
  amount,
  pidUser,
  pidProduct,
  productPrice,
  productName,
  quantity,
  currency,
  serviceID,
  serviceName,
  serviceDescription,
  activeTab,
  purchaseType,
  fullName,
  phone,
  address,
  deliveryOption,
  deliveryLocation,
  metadata = {},
  disabled = false,
  children,
}: PaystackButtonProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Load Paystack script if not already loaded
    if (!document.querySelector('script[src^="https://js.paystack.co"]')) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    if (disabled) return;
    setIsProcessing(true);

    //2F VALIDATION & ALERT FOR RELEVANT FIELDS

    //process Quantity for bulk payment to just 1
    var quantityx: any = quantity;
    if (quantityx > 1 && purchaseType === 'bulk') {
      var quantityx: any = 1;
    }

    if (amount < 7000) {
      alert('Cannot process amount less than N7000.');
      setIsProcessing(false);
      return;
    }

    if (purchaseType === 'single' && quantity >= 50) {
      alert(
        'Try Bulk purchases, for quantities greater than 50 for best pricing.',
      );
      setIsProcessing(false);
      return;
    }

    if (purchaseType === 'bulk' && quantity < 50) {
      alert('For bulk purchases, quantity must not be less than 50 units.');
      setIsProcessing(false);
      return;
    }

    if (deliveryOption === 'Pay before Delivery' && address === '') {
      alert('Please, provide a delivery address before proceeding.');
      setIsProcessing(false);
      return;
    }

    if (deliveryOption === 'Pay before Delivery' && deliveryLocation === '') {
      alert('Select a delivery location before proceeding.');
      setIsProcessing(false);
      return;
    }

    if (email === '') {
      alert('Email cannot be empty');
      setIsProcessing(false);
      return;
    }

    if (fullName === '') {
      alert('Full Name cannot be empty');
      setIsProcessing(false);
      return;
    }

    if (phone === '') {
      alert('Phone cannot be empty');
      setIsProcessing(false);
      return;
    }

    // alert(' A:' + amount + ' Q:' + quantityx + ' T:' + amount * quantityx);
    // return;

    //CREATE PAYMENT AND FAYA RECORDS
    const createResponse: any = await fetch('/api/paystackv2/create-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        pidUser,
        pidProduct,
        productPrice,
        productName,
        quantity: quantityx,
        currency,
        serviceID,
        serviceName,
        serviceDescription,

        activeTab,
        purchaseType,
        fullName,
        phone,
        address,
        deliveryOption,
        deliveryLocation,
      }),
    });

    const { pidStore, pidPayment, reference } = await createResponse.json();

    if (!createResponse.ok) {
      throw new Error('Failed to create payment record');
    }

    //----------PROCESS SUCCESSFUL AND FAILED PAYMENT------------//
    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
      email,
      amount: amount * quantityx * 100,
      ref: reference,
      metadata,

      //ACTION ON SUCCESS
      callback: (response: any) => {
        setIsProcessing(false);
        //let reference = response.reference

        sendPaymentSuccessEmail(
          reference,
          pidUser,
          pidStore,
          pidPayment,

          email,
          amount,
          pidProduct,
          productPrice as any,
          productName,
          quantity as any,
          currency,
          serviceID,
          serviceName,
          serviceDescription,
        ) as any;

        router.push('/faya-purchase-success');
      },

      //ACTION ON CLOSE
      onClose: () => {
        setIsProcessing(false);
        router.push('/faya');
      },
    });
    //----------PROCESS SUCCESSFUL AND FAILED PAYMENT------------//

    handler.openIframe();
  };

  //SEND EMAIL
  const sendPaymentSuccessEmail = async (
    reference: string,
    pidUser: string,
    pidStore: string,
    pidPayment: string,

    email: string,
    amount: number,
    pidProduct: string,
    productPrice: string,
    productName: string,
    quantity: string,
    currency: string,
    serviceID: string,
    serviceName: string,
    serviceDescription?: string,
  ) => {
    try {
      const response = await fetch('/api/paystackv2/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference,
          pidUser,
          pidStore,
          pidPayment,

          email,
          amount,
          pidProduct,
          productPrice,
          productName,
          quantity,
          currency,
          serviceID,
          serviceName,
          serviceDescription,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email');
        return;
      }

      const data: any = await response.json();

      //response message
      toast.success(data.message);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing || disabled}
      className={`w-full rounded-[50px] bg-[#3730A3] px-[30px] py-2.5 text-[16px] font-medium leading-[150%] text-white transition-all duration-200 ease-linear hover:opacity-90 disabled:!cursor-not-allowed disabled:opacity-50 md:text-[18px] md:leading-[200%] ${isProcessing ? 'cursor-not-allowed opacity-50' : ''} ${
        disabled
          ? 'cursor-not-allowed bg-gray-400 text-gray-600'
          : 'bg-[#3730A3] text-white hover:bg-[#2f2989]'
      } `}
    >
      {isProcessing ? 'Processing...' : 'Pay with Paystack'}
      {children}
    </button>
  );
};
