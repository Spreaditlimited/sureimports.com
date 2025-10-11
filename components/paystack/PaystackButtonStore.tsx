// components/PaystackButton.tsx
import React, { useState } from 'react';

interface PaystackButtonProps {
  title: string;
  email: string;
  amount: number;
  pidUser: string;
  pidProduct: string;
  productPrice: string;
  productName: string;
  quantity: string;
  currency: string;
  serviceID: string;
  serviceName: string;
  serviceDescription?: string;
  metadata?: Record<string, any>;
  publicKey: string;
  text?: string;
  disabled?: boolean;

  activeTab?: string;
  purchaseType?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  deliveryOption?: string;
  deliveryLocation?: string;

  onSuccess?: (reference: string) => void;
  onClose?: () => void;
  onVerificationComplete?: (success: boolean, data?: any) => void;
}

const PaystackButtonStore: React.FC<PaystackButtonProps> = ({
  title,
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
  metadata = {},
  publicKey,
  disabled,

  activeTab,
  purchaseType,
  fullName,
  phone,
  address,
  deliveryOption,
  deliveryLocation,

  onSuccess,
  onClose,
  onVerificationComplete,
}) => {
  //const [loading, setLoading] = useState(disabled || false);
  const [loading, setLoading] = useState(false);

  //alert('activeTab: '+activeTab+'email: ' + email + 'fullName: ' + fullName + ' phone: ' + phone + ' address: ' + address + ' deliveryOption: ' + deliveryOption + ' deliveryLocation: ' + deliveryLocation + 'amount: ' + amount + ' pidUser: ' + pidUser + ' pidProduct: ' + pidProduct + ' productPrice: ' + productPrice + ' productName: ' + productName + ' quantity: ' + quantity + ' currency: ' + currency + ' serviceID: ' + serviceID + ' serviceName: ' + serviceName + ' serviceDescription: ' + serviceDescription);

  const initializePayment = async () => {
    setLoading(true);

    if (purchaseType === 'single' && parseInt(quantity) >= 50) {
      alert(
        'Try Bulk purchases, for quantities greater than 50 for best pricing.',
      );
      setLoading(false);
      return;
    }

    if (purchaseType === 'bulk' && parseInt(quantity) < 50) {
      alert('For bulk purchases, quantity must be greater than 50');
      setLoading(false);
      return;
    }

    if (deliveryOption === 'Pay before Delivery' && address === '') {
      alert('Please, provide a delivery address before proceeding.');
      setLoading(false);
      return;
    }

    if (deliveryOption === 'Pay before Delivery' && deliveryLocation === '') {
      alert('Select a delivery location before proceeding.');
      setLoading(false);
      return;
    }

    if (email === '') {
      alert('Email cannot be empty');
      setLoading(false);
      return;
    }

    if (fullName === '') {
      alert('Full Name cannot be empty');
      setLoading(false);
      return;
    }

    if (phone === '') {
      alert('Phone cannot be empty');
      setLoading(false);
      return;
    }

    try {
      // First create the payment record via API //
      const createResponse: any = await fetch(
        '/api/paystack-payment-store/create-record',
        {
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
          }),
        },
      );

      const { pidStore, pidPayment, reference } = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error('Failed to create payment record');
      }

      //alert(pidStore + '---' + pidPayment + '---' + reference);

      // Then initialize Paystack payment
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        // @ts-ignore - Paystack is loaded globally
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email,
          amount: amount * 100,
          currency: currency || 'NGN',
          ref: reference,
          metadata: {
            ...metadata,
            custom_fields: [
              ...(metadata.custom_fields || []),
              {
                display_name: 'Product Name',
                variable_name: 'product_name',
                value: productName,
              },
              {
                display_name: 'Quantity',
                variable_name: 'quantity',
                value: quantity,
              },
            ],
          },

          callback: (response: any) => {
            alert('ON-SUCCESS REFERENCE: ' + reference);

            if (onSuccess) onSuccess(reference);
            verifyPayment(
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
            );
          },

          onClose: () => {
            if (onClose) onClose();
            setLoading(false);
          },
        });
        handler.openIframe();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Error initializing payment:', error);
      setLoading(false);
    }
  };

  //VERIFY PAYMENT
  const verifyPayment = async (
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
      alert('::VERIFY-PAYMENT::');
      const response = await fetch(
        '/api/paystack-payment-store/verify-payment',
        {
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
        },
      );

      const data = await response.json();

      if (onVerificationComplete) {
        onVerificationComplete(data.status, data);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      if (onVerificationComplete) {
        onVerificationComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Render the Paystack button
  return (
    <button
      onClick={initializePayment}
      disabled={loading}
      className={`flex w-full flex-1 items-center justify-center rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 ${
        loading ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {loading ? 'Processing...' : title || 'Pay with Paystack'}
    </button>
  );
};

export default PaystackButtonStore;
