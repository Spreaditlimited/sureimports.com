'use client';

import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

type ManagePaystackButtonProps = {
  className?: string;
};

export default function ManagePaystackButton({
  className = '',
}: ManagePaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setError('');
    setOpened(false);

    try {
      const response = await fetch('/api/intelligence/manage-link', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok || !data.manageLink) {
        throw new Error(data.message || 'Unable to open plan management.');
      }

      const billingWindow = window.open(
        data.manageLink,
        '_blank',
        'noopener,noreferrer',
      );

      if (!billingWindow) {
        window.location.href = data.manageLink;
        return;
      }

      setOpened(true);
      setIsLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to open plan management.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`${className} min-h-12 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening Paystack...
          </>
        ) : (
          <>
            Manage billing
            <ExternalLink className="h-4 w-4" />
          </>
        )}
      </button>
      {error ? (
        <p className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-relaxed text-red-700">
          {error}
        </p>
      ) : null}
      {opened ? (
        <p className="w-full max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold leading-relaxed text-emerald-700">
          Paystack opened in a new tab. This dashboard will stay here so you can
          return after managing your billing.
        </p>
      ) : null}
    </div>
  );
}
