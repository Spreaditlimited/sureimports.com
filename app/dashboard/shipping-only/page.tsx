import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';

export default async function ShippingOnlyLandingPage() {
  const authUser = await checkAuth();

  if (!authUser?.pidUser) {
    redirect('/auth/login');
  }

  const [requestReceivedCount, shippedCount, arrivedCount, invoicedCount, paidCount, completedCount, cancelledCount] =
    await Promise.all([
      prisma.shipping_only.count({
        where: { pidUser: authUser.pidUser, status: 'request-received' },
      }),
      prisma.shipping_only.count({
        where: {
          pidUser: authUser.pidUser,
          OR: [{ status: 'product-shipped' }, { status: 'ready-to-ship' }],
        },
      }),
      prisma.shipping_only.count({
        where: { pidUser: authUser.pidUser, status: 'product-arrived' },
      }),
      prisma.shipping_only.count({
        where: { pidUser: authUser.pidUser, status: 'invoiced' },
      }),
      prisma.shipping_only.count({
        where: { pidUser: authUser.pidUser, status: 'paid' },
      }),
      prisma.shipping_only.count({
        where: { pidUser: authUser.pidUser, status: 'product-delivered' },
      }),
      prisma.shipping_only.count({
        where: {
          pidUser: authUser.pidUser,
          OR: [{ status: 'request-cancelled' }, { status: 'cancelled-request' }],
        },
      }),
    ]);

  const totalRequests =
    requestReceivedCount +
    shippedCount +
    arrivedCount +
    invoicedCount +
    paidCount +
    completedCount +
    cancelledCount;

  if (totalRequests > 0) {
    redirect('/dashboard/shipping-only/all');
  }

  redirect('/dashboard/shipping-only/create');
}
