import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth/checkAuth';
import { checkoutOriginIsAllowed, checkoutReturnUrl } from '@/lib/intelligence/reportCheckoutSecurity';
import { startSpecialSourcingPayPal, confirmSpecialSourcingPayPal } from '@/lib/paypalSpecialSourcing';
export async function POST(request: Request) {
  if (!checkoutOriginIsAllowed(request)) return NextResponse.json({message:'Invalid origin.'},{status:403});
  const user = await checkAuth();
  if (!user) return NextResponse.json({message:'Please sign in again.'},{status:401});
  const body = await request.json().catch(()=>null);
  try {
    if (body?.action === 'verify' && typeof body.reference === 'string') return NextResponse.json(await confirmSpecialSourcingPayPal(body.reference, user.pidUser));
    if (typeof body?.requestId !== 'string' || !body.requestId || body.requestId.length > 191) return NextResponse.json({message:'Request reference required.'},{status:400});
    return NextResponse.json({authorizationUrl:await startSpecialSourcingPayPal(body.requestId,user.pidUser,new URL(checkoutReturnUrl(request,'/')).origin)});
  } catch(error) { return NextResponse.json({message:error instanceof Error ? error.message : 'Checkout unavailable.'},{status:409}); }
}
