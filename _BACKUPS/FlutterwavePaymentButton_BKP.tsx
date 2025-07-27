import { FlutterWaveTypes } from 'flutterwave-react-v3';
import React, { useCallback } from 'react';

interface FlutterTypes {
  amount: number;
  currency: string;

  email: string;
  phone_number: string;
  name: string;

  payment_type: string;
  consumer_id: string;
  service_id: string;
  service_name?: string;
  description?: string;

  className?: string;
}

interface Props {
  props: FlutterTypes;
}

const FlutterwavePaymentButton: React.FC<Props> = ({ props }) => {
  const handlePayment = useCallback(() => {
    console.log(
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG' + props.amount,
    );
    // Load Flutterwave's inline script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Flutterwave payment
      (window as any).FlutterwaveCheckout({
        //public_key: 'FLWPUBK-7ecbd7ff5bae8311218f66d77e0e6cae-X',
        //public_key: 'FLWPUBK_TEST-d3f6aba70bb7bf1fb8d75b46ee3bcab8-X',
        //public_key: process.env.FLUTTERWAVE_PUBLIC_KEY_TEST,
        public_key: 'FLWPUBK-7ecbd7ff5bae8311218f66d77e0e6cae-X', // Replace with your Flutterwave public key
        tx_ref: `tx-ref-${Date.now()}`, // Unique transaction reference
        amount: props.amount, // Amount to charge
        currency: props.currency, // Currency (e.g., NGN, USD, etc.)
        payment_options: 'card, banktransfer, ussd', // Payment methods
        redirect_url:
          process.env.NEXT_PUBLIC_MAIN_SITE_URL + '/dashboard/success/payment', // Redirect URL after successful payment

        meta: {
          payment_type: props.payment_type,
          consumer_id: props.consumer_id, // Optional: Add metadata
          service_id: props.service_id,
          service_name: props.service_name,
          description: props.description,
          logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },

        customer: {
          email: props.email, // Customer email
          phone_number: props.phone_number, // Customer phone number
          name: props.name, // Customer name
        },

        callback: function (response: any) {
          // Handle payment response
          console.log('Payment response:', response);
          if (response.status === 'successful') {
            alert('Payment successful!');
          } else {
            alert('Payment failed or was cancelled.');
          }
        },

        onclose: function () {
          // Handle modal close event
          console.log('Payment modal closed.');
        },
      });
    };
  }, []);

  return (
    <button
      onClick={handlePayment}
      style={{ padding: '10px 20px', fontSize: '16px' }}
      className={props.className}
    >
      Pay with Flutterwave X
    </button>
  );
};

export default FlutterwavePaymentButton;
