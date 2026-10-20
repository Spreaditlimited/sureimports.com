import { customerIdentity } from '@/lib/support/server';
import { publicSupportRequest } from '@/lib/support/public-http';
import { prisma } from '@/lib/prisma';
export async function GET(request: Request) {
  return publicSupportRequest(request, async () => {
    const identity = await customerIdentity();
    if (!identity) return { orders: [] };
    return {
      orders: await prisma.orders.findMany({
        where: { pidUser: identity.actor.id },
        select: { pidOrder: true, orderName: true, orderStatus: true },
        orderBy: { id: 'desc' },
        take: 100,
      }),
    };
  });
}
