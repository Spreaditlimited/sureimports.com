'use client';

import { useEffect } from 'react';

const PaystackPayment = () => {
  useEffect(() => {
    // Dynamically load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty array ensures the script is loaded once

  const triggerPaystackPayment = () => {
    if (typeof window !== 'undefined' && (window as any).PaystackPop) {
      const paystackHandler = (window as any).PaystackPop.setup({
        key: 'your-public-key', // Replace with your Paystack public key
        email: 'customer@example.com', // Replace with the customer's email
        amount: 5000 * 100, // Amount in kobo (5000 NGN)
        currency: 'NGN', // Replace with the preferred currency
        ref: `PSK-${Math.floor(Math.random() * 1000000000)}`, // Generate a unique reference
        callback: function (response: any) {
          // Handle the success response here
          console.log('Payment successful!', response.reference);
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });

      // Trigger the Paystack popup
      paystackHandler.openIframe();
    }
  };

  useEffect(() => {
    // Programmatically trigger the payment popup without a button click
    triggerPaystackPayment();
  }, []); // Empty array to run only on the initial render

  return <div>Processing payment...</div>;
};

export default PaystackPayment;
