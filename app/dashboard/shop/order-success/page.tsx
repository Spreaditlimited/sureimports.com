'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref');

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/shop');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-black">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-foreground dark:text-white">
          Order Placed Successfully!
        </h1>

        <p className="mb-6 text-lg text-muted-foreground dark:text-gray-400">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {reference && (
          <div className="mb-6 rounded-lg bg-slate-100 p-4 dark:bg-gray-800">
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Order Reference
            </p>
            <p className="text-lg font-mono font-semibold text-foreground dark:text-white">
              {reference}
            </p>
          </div>
        )}

        <div className="mb-6 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <Package className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="mb-1 font-semibold text-foreground dark:text-white">
                What's Next?
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground dark:text-gray-400">
                <li>• You will receive an email confirmation shortly</li>
                <li>• Your order will be prepared for pickup</li>
                <li>• You can pick up your order at our Lagos office</li>
                <li>• Bring your order reference number when picking up</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-slate-100 p-4 dark:bg-gray-800">
          <h3 className="mb-2 font-semibold text-foreground dark:text-white">
            Pickup Location
          </h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street,<br />
            Ajao Estate, Lagos, Nigeria<br />
            Phone: 0806 839 7263<br />
            Hours: 9am to 5pm weekdays (except public holidays)
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.push('/dashboard/shop')}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground dark:text-gray-400">
          Redirecting to shop in {countdown} seconds...
        </p>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <OrderSuccessContent />;
}

