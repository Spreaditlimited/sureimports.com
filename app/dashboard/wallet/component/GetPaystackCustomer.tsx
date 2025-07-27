// components/PaystackCustomer.tsx
'use client';

import { useState, useEffect } from 'react';

interface CustomerData {
  // Define your customer data interface based on Paystack's response
  [key: string]: any;
}

export default function PaystackCustomer({ email }: { email: string }) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/paystack/get-customer/${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Customer Details</h2>
      {/* {customer.data.first_name} */}
      <pre>{JSON.stringify(customer, null, 2)}</pre>
    </div>
  );
}
