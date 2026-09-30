import { getVehiclePlans } from '@/lib/vehicles/plans';
import { redirect } from 'next/navigation';
import { checkAuth } from '@/lib/auth/checkAuth';
import { prisma } from '@/lib/prisma';
import VehicleOrdersView from './VehicleOrdersView';
export default async function VehicleOrdersPage() {
  const auth = await checkAuth();
  if (!auth) redirect('/auth/login?next=/dashboard/vehicles');
  const orders = await prisma.vehicle_orders.findMany({
    where: { pidUser: auth.pidUser },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      vehicleName: true,
      quantity: true,
      status: true,
      createdAt: true,
      eta: true,
      destination: true,
    },
  });
  const plans = await getVehiclePlans(orders.map((o) => o.id));
  return (
    <VehicleOrdersView
      orders={orders.map((o) => ({
        ...o,
        paySmallSmall: plans.some((p) => p.orderId === o.id),
      }))}
    />
  );
}
