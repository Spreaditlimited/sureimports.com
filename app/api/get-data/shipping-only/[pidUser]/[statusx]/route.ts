// app/api/upload/route.ts
import { PrismaClient } from '@prisma/client';
import { random } from 'lodash';
import getFileExt from '@/app/utils/fileExt';
import fileFilter from '@/utils/fileFilter';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug } from '@/utils/slugGenerator';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pidUser: string; statusx: string }> },
) {
  try {
    const { pidUser, statusx } = await params;
    const whereFilter =
      statusx === 'all'
        ? { pidUser: pidUser }
        : statusx === 'product-shipped'
          ? {
              pidUser: pidUser,
              status: { in: ['product-shipped', 'ready-to-ship'] },
            }
          : {
              pidUser: pidUser,
              status: statusx,
            };

    const orders = await prisma.shipping_only.findMany({
      where: whereFilter,
      select: {
        id: true,
        pidShippingOnly: true,
        pidUser: true,
        whatsappNumber: true,
        shippingName: true,
        shippingTo: true,
        grossWeight: true,
        trackingNumber: true,
        shippingPlan: true,
        wantProductVerification: true,
        wantConsolidation: true,
        multipleSuppliers: true,
        description: true,
        status: true,
        createdAt: true,
      },
      orderBy: [
        { id: 'desc' },
        //{ createdAt: 'asc' },
      ],
    });

    if (!orders) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const shippingPlanIds = Array.from(
      new Set(
        orders
          .map((order) => order.shippingPlan)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    const planRecords = await prisma.shippingplan.findMany({
      where: {
        pidShippingPlan: {
          in: shippingPlanIds,
        },
      },
      select: {
        pidShippingPlan: true,
        shippingPlanName: true,
      },
    });

    const planNameById = new Map(
      planRecords.map((plan) => [plan.pidShippingPlan, plan.shippingPlanName]),
    );

    const countryIds = Array.from(
      new Set(
        orders
          .map((order) => order.shippingTo)
          .filter((value): value is string => Boolean(value)),
      ),
    );

    const countryRecords = await prisma.country.findMany({
      where: {
        pidCountry: {
          in: countryIds,
        },
      },
      select: {
        pidCountry: true,
        countryName: true,
      },
    });

    const countryNameById = new Map(
      countryRecords.map((country) => [country.pidCountry, country.countryName]),
    );

    const formatPlanLabel = (value: string) =>
      value.replace(/_/g, ' ').trim();

    const ordersWithDisplayPlan = orders.map((order) => {
      const planName = planNameById.get(order.shippingPlan || '') || order.shippingPlan || '';
      const countryName =
        countryNameById.get(order.shippingTo || '') || order.shippingTo || '';

      return {
        ...order,
        status: order.status === 'ready-to-ship' ? 'product-shipped' : order.status,
        shippingTo: countryName,
        shippingPlan: formatPlanLabel(planName),
      };
    });

    return NextResponse.json(ordersWithDisplayPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
