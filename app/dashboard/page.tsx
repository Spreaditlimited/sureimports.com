import React from 'react';
import Procurement from './procurement/components/ProcurementComponent';
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
      <Procurement />
      <ProfileReminder />
    </div>
  );
};

export default DashBoard;
