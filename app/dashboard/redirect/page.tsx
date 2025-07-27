import React from 'react';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

const DashBoard = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page } = await searchParams;
  if (!page) {
    notFound();
  }

  redirect(`/dashboard/${page}`);

  return <div>{/* Redirect */}</div>;
};

export default DashBoard;
