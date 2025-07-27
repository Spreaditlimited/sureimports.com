'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handles GET requests to /api
export async function GET(req: NextRequest, res: Response) {
  const url = new URL(req.url);
  const pidUser = url.searchParams.get('pidUser') as string;
  const cid = url.searchParams.get('cid') as string;

  //CHECK IF USER PID AND CID EXISTS
  const user = await prisma.users.findUnique({
    where: {
      pidUser: pidUser,
      userCid: cid,
    },
  });

  if (user) {
    console.log('User exists.');
    //UPDATE THE CID TO VALIDATE USER
    const post = await prisma.users.update({
      where: { pidUser: pidUser, userCid: cid },
      data: { userCid: 'VERIFIED' },
    });

    //ADD USER TO FLODESK
    const response = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(process.env.FLODESK_API_KEY + ':').toString('base64')}`,
        'User-Agent': 'Sure Imports (www.sureimports.com)',
      },
      body: JSON.stringify({
        email: user.userEmail,
        first_name: user.userFirstname,
        last_name: user.userLastname,
        segment_ids: ['67699403ee348d7f8cb68f3a'],
      }),
    });

    console.log('response', response);

    // if (!response.ok) {
    // throw new Error('Failed to add subscriber to Flodesk');
    // }

    //server side redirect
    console.log('Verification Successful!');
    revalidatePath('/auth/account-verification-success');
    redirect('/auth/account-verification-success');
  } else {
    //server side redirect
    console.log('User does not exist OR CID IS INVALID.');
    revalidatePath('/auth/account-not-activated');
    redirect('/auth/account-not-activated');
  }

  //END
}

// Handles POST requests to /api
export async function POST(req: Request) {
  // ...
  return NextResponse.json({ message: 'Success' });
}
