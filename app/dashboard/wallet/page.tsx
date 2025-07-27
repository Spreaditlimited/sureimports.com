import React from 'react';
import WalletComponent from './component/wallet-component';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from '@/app/utils/jwt';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import ProfileReminder from '@/components/dashboard/profile-reminder/ProfileReminder';
// import { useAuth } from '@/app/context/AuthContext';

const DashBoard = () => {
  //redirct
  //redirect('/dashboard/procurement');

  return (
    <div>
      <WalletComponent />
    </div>
  );
};

export default DashBoard;
