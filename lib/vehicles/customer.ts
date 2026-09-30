import 'server-only';
import { getVehiclePlan } from './plans';
import { prisma } from '@/lib/prisma';
export type VehicleInvoice = {
  pidInvoice: string;
  invoiceNumber: string;
  grandTotal: string;
  amountPaid: string;
  balanceDue: string;
  status: string;
  customerNotes: string | null;
};
export type VehicleBank = {
  pidBankAccount: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  notes: string | null;
};
export async function customerVehicleOrder(id: string, pidUser: string) {
  const order = await prisma.vehicle_orders.findFirst({
    where: { id, pidUser },
    include: {
      events: {
        orderBy: { createdAt: 'asc' },
        select: { id: true, type: true, message: true, createdAt: true },
      },
      proofs: { select: { id: true, claimId: true, createdAt: true } },
    },
  });
  if (!order) return null;
  const plan = await getVehiclePlan(id);
  const reversals = plan
    ? await prisma.$queryRaw<
        { claimId: string }[]
      >`SELECT claimId FROM vehicle_credit_reversals WHERE orderId=${id} AND status='CONFIRMED'`
    : [];
  const invoice = order.pidInvoice
    ? (
        await prisma.$queryRaw<
          VehicleInvoice[]
        >`SELECT pidInvoice, invoiceNumber, grandTotal, amountPaid, balanceDue, status, customerNotes FROM invoices WHERE pidInvoice = ${order.pidInvoice} AND pidUser = ${pidUser}`
      )[0]
    : null;
  const banks =
    invoice && Number(invoice.balanceDue) > 0
      ? await prisma.$queryRaw<
          VehicleBank[]
        >`SELECT pidBankAccount, bankName, accountName, accountNumber, notes FROM invoice_bank_accounts WHERE status = 'ACTIVE' AND currency = 'NGN' AND (LOWER(country) = 'nigeria' OR UPPER(country) = 'NG') ORDER BY displayOrder, id`
      : [];
  const tokens = order.pidInvoice
    ? await prisma.$queryRaw<
        { accessToken: string }[]
      >`SELECT accessToken FROM invoice_access_tokens WHERE pidInvoice = ${order.pidInvoice} AND revokedAt IS NULL AND expiresAt > NOW() ORDER BY createdAt DESC LIMIT 1`
    : [];
  const claims = order.pidInvoice
    ? await prisma.$queryRaw<
        {
          pidClaim: string;
          claimedAmount: string;
          status: string;
          reviewNote: string | null;
        }[]
      >`SELECT pidClaim, claimedAmount, status, reviewNote FROM invoice_payment_claims WHERE pidInvoice = ${order.pidInvoice} ORDER BY claimedAt DESC`
    : [];
  const snapshot = order.priceSnapshot as {
    vehicleNgn?: number;
    shippingNgn?: number;
    totalNgn?: number;
  } | null;
  // Explicit projection: supplier cost and margin must never reach the customer.
  return {
    plan,
    id: order.id,
    vehicleName: order.vehicleName,
    quantity: order.quantity,
    status: order.status,
    destination: order.destination,
    eta: order.eta,
    createdAt: order.createdAt,
    quoteExpiresAt: order.quoteExpiresAt,
    events: order.events,
    proofs: order.proofs,
    invoice,
    banks,
    claims: claims.map((c) =>
      reversals.some((r) => r.claimId === c.pidClaim)
        ? { ...c, status: 'REVERSED' }
        : c,
    ),
    price: snapshot
      ? {
          vehicleNgn: snapshot.vehicleNgn,
          shippingNgn: snapshot.shippingNgn,
          totalNgn: snapshot.totalNgn,
        }
      : null,
    invoiceUrl: tokens[0] ? `/invoice/${tokens[0].accessToken}` : null,
  };
}
