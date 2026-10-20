'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { IntelligencePlanKey } from '@/lib/intelligence/plans';

type SubscribeButtonProps = {
  plan: IntelligencePlanKey;
  currency?: 'NGN' | 'USD';
  available?: boolean;
  unavailableLabel?: string;
  children: React.ReactNode;
  className?: string;
};

export default function SubscribeButton({
  plan,
  children,
  className = '',
  currency = 'NGN',
  available = true,
  unavailableLabel = 'Pricing coming soon',
}: SubscribeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        currency === 'USD'
          ? '/api/intelligence/paypal'
          : '/api/intelligence/subscribe',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, action: 'subscription' }),
        },
      );

      if (response.status === 401) {
        router.push(
          `/auth/login?next=${encodeURIComponent('/supplier-intelligence')}`,
        );
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.message || 'Unable to start checkout.');
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to start checkout.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={isLoading || !available}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting checkout...
          </>
        ) : available ? (
          children
        ) : (
          unavailableLabel
        )}
      </button>
      {error ? (
        <p className="text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
