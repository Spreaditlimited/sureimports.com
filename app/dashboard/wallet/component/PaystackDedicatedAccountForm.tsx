'use client';

import { useState } from 'react';

interface DedicatedAccountRequest {
  customerId: number;
  preferredBank: string;
}

const PaystackDedicatedAccountForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>(null);

  const [formData, setFormData] = useState<DedicatedAccountRequest>({
    customerId: 0,
    preferredBank: 'wema-bank',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'customerId' ? value || '' : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/paystack/dedicated-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData.customerId,
          preferred_bank: formData.preferredBank,
        }),
      });

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to create dedicated account');
      }

      setSuccess(true);
      setAccountDetails(data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-mdx mx-auto rounded-lg bg-white p-6 shadow-md dark:bg-gray-700 dark:text-white">
      <h2 className="mb-4 text-xl font-semibold dark:text-white">
        Create Dedicated Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Customer ID
          </label>
          <input
            type="string"
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="preferredBank"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Preferred Bank
          </label>
          <select
            id="preferredBank"
            name="preferredBank"
            value={formData.preferredBank}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            required
          >
            <option value="wema-bank">Wema Bank</option>
            {/* <option value="access-bank">Access Bank</option>
            <option value="zenith-bank">Zenith Bank</option> */}
            {/* Add more bank options as needed */}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {success && accountDetails && (
        <div className="mt-4 rounded border border-green-400 bg-green-100 p-3 text-green-700">
          <h3 className="font-semibold">Account Created Successfully!</h3>
          <div className="mt-2">
            <p>
              <strong>Bank:</strong> {accountDetails.bank.name}
            </p>
            <p>
              <strong>Account Number:</strong> {accountDetails.account_number}
            </p>
            <p>
              <strong>Account Name:</strong> {accountDetails.account_name}
            </p>
          </div>
          <br />
          <small>
            <i>You may now fund this account to credit your wallet</i>
          </small>
        </div>
      )}
    </div>
  );
};

export default PaystackDedicatedAccountForm;
