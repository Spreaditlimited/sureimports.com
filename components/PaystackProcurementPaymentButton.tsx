'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
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
  isDisabled?: boolean;
  nextStatus?: string;
  newTotalAmount?: number;
  newTotalWeight?: number;
  newEstimatedTotalShippingCost?: number;
}

const ensurePaystackScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).PaystackPop?.setup) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(Boolean((window as any).PaystackPop?.setup));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function PaystackProcurementPaymentButton({
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
  nextStatus,
  newTotalAmount,
  newTotalWeight,
  newEstimatedTotalShippingCost,
}: PaymentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    const amountNairax = Number(amountNaira || 0);
    const totalWeightx = Number(totalWeight || 0);
    const isNigeria = destinationCountry === 'Nigeria';

    if (amount >= 1000 && !isNigeria) {
      alert(
        'Please, use the bank deposit payment option for orders of $1,000 and above.',
      );
      return;
    }

    if (amount < 200 && !isNigeria) {
      alert(
        'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
      );
      return;
    }

    if (amountNairax < 100000 && isNigeria) {
      alert(
        'We do not process orders less than N100,000. Please, edit your order.',
      );
      return;
    }

    if (totalWeightx < 10 && !isNigeria) {
      alert(
        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
      );
      return;
    }

    if (!isDisabled) return;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      alert('Paystack public key is not configured.');
      return;
    }

    setIsLoading(true);

    const payCurrency = isNigeria ? 'NGN' : currency || 'USD';
    const payAmount = isNigeria ? amountNairax : amount;
    const reference = `PROCPAY_${Date.now()}`;

    const paystackReady = await ensurePaystackScript();
    if (!paystackReady || !(window as any).PaystackPop?.setup) {
      setIsLoading(false);
      alert('Unable to load Paystack. Please try again.');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: publicKey,
      email,
      amount: Math.round(payAmount * 100),
      currency: payCurrency,
      ref: reference,
      metadata: {
        service_id,
        service_name,
        consumer_id,
        destinationCountry,
      },
      callback: () => {
        verifyPayment(reference, payAmount, payCurrency);
      },
      onClose: () => {
        setIsLoading(false);
      },
    });

    handler.openIframe();
  };

  const verifyPayment = async (
    reference: string,
    paymentAmount: number,
    paymentCurrency: string,
  ) => {
    try {
      const response = await fetch('/api/paystack-payment/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          amount: paymentAmount,
          email,
          name,
          phone_number,
          currency: paymentCurrency,
          payment_type,
          consumer_id,
          service_id,
          service_name,
          description,
          nextStatus,
          newTotalAmount,
          newTotalWeight,
          newEstimatedTotalShippingCost,
        }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        alert('Payment verified successfully!');
        router.push(
          nextStatus
            ? `/dashboard/procurement/view-orders/${nextStatus}`
            : '/dashboard/success/payment',
        );
      } else {
        alert(data.message || 'Payment verification failed.');
        router.push('/dashboard/failed/payment');
      }
    } catch (error) {
      console.error('Error verifying Paystack payment:', error);
      alert('An error occurred while verifying the payment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={className}>
      <CreditCard />
      {isLoading ? '  Processing...  ' : '  Pay with Paystack  '}
    </Button>
  );
}
