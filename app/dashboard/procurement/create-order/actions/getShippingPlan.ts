'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getOrderProducts(orderId: number) {
  try {
    const plan = await prisma.shippingplan.findUnique({
      where: { id: orderId },
      //include: { products: true },
    });

    if (!plan) {
      throw new Error('Order not found');
    }

    return plan;
  } catch (error) {
    console.error('Failed to fetch order products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
