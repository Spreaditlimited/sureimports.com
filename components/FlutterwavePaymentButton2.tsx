'use client';

import { useRouter } from 'next/navigation';
import router from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import { CreditCard, IdCardIcon } from 'lucide-react';
import { Button } from './ui/button';

interface PaymentButtonProps {
  amount: number;
  amountNaira?: number;
  destinationCountry: string;
  totalWeight?: number;
  email: string;
  name: string;
  phone_number: string;
  currency: string;
  payment_type: string;
  consumer_id: string;
  service_id: string;
  service_name?: string;
  description?: string;
  className?: string;
  isDisabled?: true | false;
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: any) => void;
  }
}

export default function PaymentButton({
  amount,
  amountNaira,
  destinationCountry,
  totalWeight,
  email,
  name,
  phone_number,
  currency,
  payment_type,
  consumer_id,
  service_id,
  service_name,
  description,
  className,
  isDisabled,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = () => {
    let amountNairax = amountNaira as any;
    let totalWeightx = totalWeight as any;
    let destinationCountryx = destinationCountry as any;

    if (amount >= 1000 && destinationCountryx != 'Nigeria') {
      alert(
        'Please, use the bank deposit payment option for orders of $1,000 and above.',
      );
      return;
    }

    //check minimum amount limit in dollars
    // if (amount < 200 && destinationCountryx != 'Nigeria') {
    //   alert(
    //     'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
    //   );
    //   return;
    // }

    //check amount limit in naira
    // if (amountNairax >= 50000 && destinationCountryx == 'Nigeria') {
    //   alert(
    //     'You cannot pay for orders more than N500,000 with Flutterwave. Please, use bank deposit.',
    //   );
    //   return;
    // }

    //check minimum amount limit in naira
    // if (amountNairax < 100000 && destinationCountryx == 'Nigeria') {
    //   alert(
    //     'We do not process orders less than N100,000. Please, edit your order.',
    //   );
    //   return;
    // }

    //check amount limit in naira
    if (totalWeightx < 10 && destinationCountryx != 'Nigeria') {
      alert(
        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
      );
      return;
    }

    setIsLoading(true);
    //const currency = 'USD'; //fixed type of currency

    //check a update appropriate currency and amount to pay
    let currencyx = 'USD';
    let amountx = amount;
    if (destinationCountryx == 'Nigeria') {
      currencyx = 'NGN';
      amountx = amountNairax;
    } else {
      currencyx = 'USD';
      amountx = amount;
    }

    if (!isDisabled) {
      setIsLoading(false);
      return null;
    } else {
      setIsLoading(true);
    }

    //useEffect(() => {
    window.FlutterwaveCheckout({
      //TRANSACTION DATA
      //public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      //public_key: 'FLWPUBK_TEST-d3f6aba70bb7bf1fb8d75b46ee3bcab8-X',
      public_key: 'FLWPUBK-7ecbd7ff5bae8311218f66d77e0e6cae-X',
      //public_key: `${process.env.FLUTTERWAVE_PUBLIC_KEY}`,
      //tx_ref: Date.now().toString(),
      tx_ref: Date.now().toString(),
      amount: amountx.toFixed(2),
      currency: currencyx,
      payment_options: 'card, mobilemoney, ussd',

      //CUSTOMER DETAILS
      customer: {
        email: email,
        name: name,
        phone_number: phone_number,
      },

      //CUSTOMIZATIONS
      customizations: {
        title: 'SureImports',
        description: 'SureImports Services Payment',
        logo: 'https://www.sureimports.com/images/favicon.png',
      },

      //CALL BACK RESPONSE
      callback: (response: any) => {
        console.log(response);
        verifyPayment(response.transaction_id, response.tx_ref);
      },

      //ACTION ON-CLOSE
      onclose: () => {
        setIsLoading(false);
      },
    });
  };

  const verifyPayment = async (transactionId: string, tx_ref: string) => {
    try {
      const response = await fetch('/api/flutterwave/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          tx_ref,
          amount,
          email,
          name,
          phone_number,
          currency,
          payment_type,
          consumer_id,
          service_id,
          service_name,
          description,
        }),
      });
      const data = await response.json();

      const router = useRouter();

      if (data.status === 'success') {
        alert('Payment verified successfully!');
        router.push('/dashboard/success/payment');
      } else {
        alert('Payment verification failed.');
        router.push('/dashboard/failed/payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('An error occurred while verifying the payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className={className}
      >
        <CreditCard />
        {isLoading ? '  Processing...  ' : '  Pay with Flutterwave  '}
      </Button>
      {/* <button onClick={handlePayment} disabled={isLoading} className={className}>
                      <CreditCard />
      {isLoading ? '  Processing...  ' : '  Pay with Flutterwave  '}
    </button> */}
    </>
  );
}
