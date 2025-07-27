// app/components/GetDedicatedAccount.tsx
'use client';

import { useState } from 'react';

export default function GetDedicatedAccount() {
  const [accountId, setAccountId] = useState('');
  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = async () => {
    if (!accountId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dedicated-account/${accountId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch account');
      }

      const data = await response.json();
      setAccountData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        placeholder="Enter dedicated account ID"
      />
      <button onClick={fetchAccount} disabled={loading}>
        {loading ? 'Loading...' : 'Get Account'}
      </button>

      {error && <p className="error">{error}</p>}

      {accountData && <pre>{JSON.stringify(accountData, null, 2)}</pre>}
    </div>
  );
}
