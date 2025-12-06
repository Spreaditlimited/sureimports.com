import React from 'react';
import CustomerForm from '../component/CustomerForm';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export default function CustomerPage() {
  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Create Profile</h1>
        <CustomerForm />
      </div>
    </div>
  );
}
