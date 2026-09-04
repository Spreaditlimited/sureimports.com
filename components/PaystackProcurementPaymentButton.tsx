'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CreditCard, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN,
  procurementMinimumOrderMessage,
} from '@/lib/procurement/minimumOrder';

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
  enforceMinimumOrderRules?: boolean;
  onMinimumOrderBlocked?: () => void;
  minimumOrderNgn?: number;
}

type PaystackHandler = {
  openIframe: () => void;
};

type PaystackPop = {
  setup(config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    ref: string;
    metadata: Record<string, string | undefined>;
    callback: () => void;
    onClose: () => void;
  }): PaystackHandler;
};

const getPaystackPop = () =>
  (window as Window & { PaystackPop?: PaystackPop }).PaystackPop;

const ensurePaystackScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (getPaystackPop()?.setup) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), {
        once: true,
      });
      existingScript.addEventListener('error', () => resolve(false), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(Boolean(getPaystackPop()?.setup));
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
  enforceMinimumOrderRules,
  onMinimumOrderBlocked,
  minimumOrderNgn = DEFAULT_PROCUREMENT_MINIMUM_ORDER_NGN,
}: PaymentButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    redirectTo: string;
  } | null>(null);

  const closePaymentFeedback = () => {
    const redirectTo = paymentFeedback?.redirectTo;
    setPaymentFeedback(null);
    if (redirectTo) router.push(redirectTo);
  };

  const handlePayment = async () => {
    if (!isDisabled) return;

    const amountNairax = Number(amountNaira || 0);
    const totalWeightx = Number(totalWeight || 0);
    const isNigeria = destinationCountry.trim().toLowerCase() === 'nigeria';

    if (amount >= 1000 && !isNigeria) {
      alert(
        'Please, use the bank deposit payment option for orders of $1,000 and above.',
      );
      return;
    }

    if (enforceMinimumOrderRules && amount < 200 && !isNigeria) {
      alert(
        'We cannot process orders of less than $200 for orders going to your destination. Please, edit your order',
      );
      return;
    }

    if (
      enforceMinimumOrderRules &&
      amountNairax < minimumOrderNgn &&
      isNigeria
    ) {
      if (onMinimumOrderBlocked) {
        onMinimumOrderBlocked();
      } else {
        alert(procurementMinimumOrderMessage(minimumOrderNgn));
      }
      return;
    }

    if (enforceMinimumOrderRules && totalWeightx < 10 && !isNigeria) {
      alert(
        'We cannot ship orders with weight less than 10kg to your destination. Please, edit your order.',
      );
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      alert('Paystack public key is not configured.');
      return;
    }

    setIsLoading(true);

    let quoteResponse: Response;
    try {
      quoteResponse = await fetch(
        `/api/get-data/procurement-product-data?pidOrder=${encodeURIComponent(service_id)}`,
        { cache: 'no-store' },
      );
    } catch {
      setIsLoading(false);
      alert('Unable to confirm the current order amount. Please try again.');
      return;
    }
    if (!quoteResponse.ok) {
      setIsLoading(false);
      alert('Unable to confirm the current order amount. Please try again.');
      return;
    }
    const quote = await quoteResponse.json();
    const payCurrency = quote.paymentDueCurrency === 'NGN' ? 'NGN' : 'USD';
    const payAmount = Number(quote.paymentDue || 0);
    const displayedAmount = isNigeria ? amountNairax : amount;
    const displayedCurrency = isNigeria ? 'NGN' : currency || 'USD';
    if (
      payAmount <= 0 ||
      payCurrency !== displayedCurrency ||
      Math.abs(payAmount - displayedAmount) > 0.01
    ) {
      setIsLoading(false);
      alert('The order amount changed. The page will refresh before payment.');
      router.refresh();
      return;
    }
    const reference = `PROCPAY_${Date.now()}`;

    const paystackReady = await ensurePaystackScript();
    const paystack = getPaystackPop();
    if (!paystackReady || !paystack?.setup) {
      setIsLoading(false);
      alert('Unable to load Paystack. Please try again.');
      return;
    }

    const handler = paystack.setup({
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
        }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        const paidAmount = new Intl.NumberFormat(
          paymentCurrency === 'NGN' ? 'en-NG' : 'en-US',
          {
            style: 'currency',
            currency: paymentCurrency,
            minimumFractionDigits: 2,
          },
        ).format(paymentAmount);
        setPaymentFeedback({
          type: 'success',
          title: 'Payment verified',
          message: `${paidAmount} has been received successfully. Your order is ready to continue.`,
          redirectTo:
            data.nextStatus || nextStatus
              ? `/dashboard/procurement/view-orders/${data.nextStatus || nextStatus}`
              : '/dashboard/success/payment',
        });
      } else {
        setPaymentFeedback({
          type: 'error',
          title: 'Verification unsuccessful',
          message:
            data.message ||
            'We could not verify this payment. Please review the payment status.',
          redirectTo: '/dashboard/failed/payment',
        });
      }
    } catch (error) {
      console.error('Error verifying Paystack payment:', error);
      setPaymentFeedback({
        type: 'error',
        title: 'Verification unsuccessful',
        message:
          'An error occurred while verifying the payment. Please review the payment status before trying again.',
        redirectTo: '/dashboard/failed/payment',
      });
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
        {isLoading ? '  Processing...  ' : '  Pay with Paystack  '}
      </Button>

      <Dialog
        open={Boolean(paymentFeedback)}
        onOpenChange={(open) => {
          if (!open) closePaymentFeedback();
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] rounded-[32px] p-8 text-center sm:max-w-md">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              paymentFeedback?.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-rose-100 dark:bg-rose-900/30'
            }`}
          >
            {paymentFeedback?.type === 'success' ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            ) : (
              <XCircle className="h-8 w-8 text-rose-600" />
            )}
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-slate-900 dark:text-white">
              {paymentFeedback?.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-center leading-relaxed text-slate-500">
              {paymentFeedback?.message}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={closePaymentFeedback}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {paymentFeedback?.type === 'success'
              ? 'Continue'
              : 'View Payment Status'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
