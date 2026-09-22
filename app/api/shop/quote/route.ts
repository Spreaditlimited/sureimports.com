import { NextResponse } from 'next/server';
import { shopOrigin, shopFailure } from '@/lib/shop/auth';
import { quoteShopCart } from '@/lib/shop/checkout';
export async function POST(request: Request) {
  try {
    shopOrigin(request);
    const body = await request.json();
    return NextResponse.json({
      statusx: 'SUCCESS',
      data: await quoteShopCart(body.cartItems),
    });
  } catch (error) {
    return shopFailure(error);
  }
}
