import React from 'react';
import PaystackDedicatedAccountForm from '../component/PaystackDedicatedAccountForm';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileReminder from '@/components/dashboard/profile-reminder/ProfileReminder';

const DashBoard = () => {
  //redirct
  //redirect('/dashboard/procurement');

  return (
    <div>
      <div className="container mx-auto py-8">
        <h1 className="mb-6 text-2xl font-bold">
          Create Paystack Dedicated Account
        </h1>
        <PaystackDedicatedAccountForm />
      </div>
    </div>
  );
};

export default DashBoard;
