'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import RadText from '@/components/uix/xForm/RadText';
import { Landmark, User, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import nigerianBanks from '@/lib/data/nigerianBanks';

interface TransferRecipientResponse {
  status: boolean;
  message: string;
  data?: {
    recipient_code: string;
    type: string;
    name: string;
    account_number: string;
    bank_code: string;
    bank_name: string;
    currency: string;
    id: number;
    integration: number;
    domain: string;
    details: any;
    metadata: any;
    is_deleted: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export default function TestPaystackTransferPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipientData, setRecipientData] = useState<TransferRecipientResponse['data'] | null>(null);

  // Form states
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBank(value);
    
    // Extract bank code from the value (format: "BankName - Code")
    const bank = nigerianBanks.find(b => `${b.name} - ${b.code}` === value);
    if (bank) {
      setBankCode(bank.code);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate inputs
    if (!accountName || !accountNumber || !bankCode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (accountNumber.length < 10) {
      toast.error('Account number must be at least 10 digits');
      return;
    }

    setIsLoading(true);
    setRecipientData(null);

    try {
      toast.info('Creating transfer recipient...');

      const response = await fetch('/api/paystack/create-transfer-recipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: accountName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        }),
      });

      const data: TransferRecipientResponse = await response.json();

      if (data.status) {
        toast.success(data.message || 'Transfer recipient created successfully!');
        setRecipientData(data.data || null);
      } else {
        toast.error(data.message || 'Failed to create transfer recipient');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAccountName('');
    setAccountNumber('');
    setBankCode('');
    setSelectedBank('');
    setRecipientData(null);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Test Paystack Transfer Recipient API
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create a transfer recipient to test the Paystack API integration
        </p>
      </div>

      <RadFormLayout title="Create Transfer Recipient" subtitle="Enter bank account details">
        <form onSubmit={handleSubmit}>
          {/* Account Name */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/1">
              <RadText
                label="Account Name"
                reacticon={<User className="text-gray-400" />}
                name="account_name"
                id="account_name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                disable={false}
                placeholder="e.g., Tolu Robert"
              />
            </div>
          </div>

          {/* Account Number */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/1">
              <RadText
                label="Account Number"
                reacticon={<CreditCard className="text-gray-400" />}
                name="account_number"
                id="account_number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                disable={false}
                placeholder="e.g., 0123456789"
              />
            </div>
          </div>

          {/* Bank Selection */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Bank
                </label>
                <div className="relative flex items-center">
                  <Landmark className="absolute left-3 text-gray-400" size={20} />
                  <select
                    value={selectedBank}
                    onChange={handleBankChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">-- Select Bank --</option>
                    {nigerianBanks.map((bank) => (
                      <option key={bank.code} value={`${bank.name} - ${bank.code}`}>
                        {bank.name} ({bank.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Code Display */}
          {bankCode && (
            <div className="flex flex-col md:flex-row">
              <div className="w-full p-2 md:w-1/1">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Selected Bank Code:</strong> {bankCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            <div className="flex flex-col md:flex-row">
              <div className="w-full p-2 md:w-auto">
                <Button
                  type="button"
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </div>
              <div className="w-full p-2 md:w-auto">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create Recipient
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </RadFormLayout>

      {/* Response Display */}
      {recipientData && (
        <div className="mt-6">
          <RadFormLayout title="API Response" subtitle="Transfer recipient created successfully">
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex items-start">
                  <CheckCircle2 className="mr-3 mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Success!
                    </h3>
                    <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                      Transfer recipient has been created successfully.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recipient Code
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                    {recipientData.recipient_code}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {recipientData.name}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Number
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                    {recipientData.account_number}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {recipientData.bank_name}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Code
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                    {recipientData.bank_code}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Currency
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {recipientData.currency}
                  </p>
                </div>
              </div>

              {/* Full JSON Response */}
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Full JSON Response
                </p>
                <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-xs dark:bg-gray-900">
                  {JSON.stringify(recipientData, null, 2)}
                </pre>
              </div>
            </div>
          </RadFormLayout>
        </div>
      )}
    </div>
  );
}

