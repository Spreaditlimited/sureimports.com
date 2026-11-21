import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPhonePriceList, phonePriceListRows } from '@/lib/shop/phone-price-list.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.store.findMany({
      where: { productVisibility: true, productCategory: { in: ['phone', 'phones', 'Phones'] } },
      select: { pidProduct: true, productName: true, productBrand: true, productPrice: true,
        productCondition: true, productMOQ: true, productStatus: true,
        productVisibility: true, productCategory: true },
    });
    if (!phonePriceListRows(products).length) return NextResponse.json({ message: 'No phones are available for a price list right now.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    const logo = await readFile(path.join(process.cwd(), 'public/images/logo.png'));
    return new Response(createPhonePriceList(products, logo), {
      headers: { 'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Sure-Imports-Phone-Price-List.pdf"',
        'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' },
    });
  } catch (error) {
    console.error('Phone price list generation failed', error);
    return NextResponse.json({ message: 'We could not generate the price list. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
