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

  async function handleClick() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/intelligence/manage-link', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok || !data.manageLink) {
        throw new Error(data.message || 'Unable to open plan management.');
      }

      window.location.href = data.manageLink;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to open plan management.',
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={className}
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
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
