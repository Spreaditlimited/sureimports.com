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
    const orders = await prisma.shipping_only.findMany({
      where: {
        pidUser: pidUser,
        status: statusx,
      },
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

    const formatPlanLabel = (value: string) =>
      value.replace(/_/g, ' ').trim();

    const ordersWithDisplayPlan = orders.map((order) => {
      const planName = planNameById.get(order.shippingPlan || '') || '';
      return {
        ...order,
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
