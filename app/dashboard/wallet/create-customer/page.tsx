import React from 'react';
import PaystackDedicatedAccountForm from '../component/PaystackDedicatedAccountForm';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileReminder from '@/components/dashboard/profile-reminder/ProfileReminder';
import CustomerForm from '../component/CustomerForm';
import { PaystackCustomer, PaystackResponse } from '@/app/types/paystack';

interface PageProps {
  params: { identifier: string };
}

export default async function CustomerPage({ params }: PageProps) {
  let customer: PaystackCustomer | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(
      `https://api.paystack.co/customer/${params.identifier}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }

    const data: PaystackResponse = await response.json();
    customer = data.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching customer:', err);
  }
  //const DashBoard = () => {
  //redirct
  //redirect('/dashboard/procurement');

  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">Create Profile</h1>
        <CustomerForm />
      </div>
    </div>
  );
}

//export default DashBoard;
