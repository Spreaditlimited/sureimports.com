import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import { sameOrigin, inputText } from '@/lib/vehicles/http';
import { refundDeadline } from '@/lib/vehicles/refunds';
import { getVehiclePlan, getPlanSettings } from '@/lib/vehicles/plans';
import { vehicleEvent } from '@/lib/vehicles/events';
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await checkAuth();
  if (!auth)
    return Response.json({ message: 'Sign in to continue.' }, { status: 401 });
  try {
    sameOrigin(request);
    const { id } = await params;
    const body = await request.json();
    await prisma.$transaction(
      async (tx) => {
        await tx.$queryRaw`SELECT id FROM vehicle_orders WHERE id=${id} FOR UPDATE`;
        const order = await tx.vehicle_orders.findFirst({
          where: { id, pidUser: auth.pidUser },
        });
        if (!order) throw new Error('Order not found.');
        const plan = await getVehiclePlan(id, tx);
        if (!plan) throw new Error('This order has no Pay Small Small plan.');
        if (body.action === 'accept') {
          if (['ACCEPTED', 'ACTIVE', 'COMPLETED'].includes(plan.status)) return;
          if (
            plan.status !== 'OFFERED' ||
            !plan.terms ||
            order.status !== 'QUOTED'
          )
            throw new Error('This plan is not awaiting acceptance.');
          if (!plan.expiresAt || new Date(plan.expiresAt) < new Date())
            throw new Error(
              'This offer expired. Ask our team to reconfirm it.',
            );
          if (
            body.consent !== true ||
            body.revision !== plan.terms.revision ||
            body.totalMinor !== plan.terms.totalMinor
          )
            throw new Error('Review and accept the current plan terms.');
          await tx.$executeRaw`UPDATE vehicle_payment_plans SET status='ACCEPTED',acceptedAt=NOW(3),updatedAt=NOW(3) WHERE orderId=${id}`;
          await vehicleEvent(
            tx,
            id,
            'PLAN_ACCEPTED',
            `You accepted Pay Small Small terms version ${plan.terms.version}, settings revision ${plan.terms.revision}. Pay the minimum deposit before the offer expires. Procurement begins only after full approved payment.`,
            auth.pidUser,
          );
        } else if (body.action === 'cancel_request') {
          if (plan.status === 'PAYMENT_REVIEW')
            throw new Error(
              'Finance must resolve the bank payment review before cancellation.',
            );
          if (
            [
              'CANCELLATION_REQUESTED',
              'REFUND_PENDING',
              'CANCELLED',
              'REFUNDED',
            ].includes(plan.status)
          )
            return;
          if (!['ENQUIRY', 'QUOTED', 'ORDER_CONFIRMED'].includes(order.status))
            throw new Error(
              'Procurement has started. Contact our team for a supplier cancellation review.',
            );
          const reason = inputText(body.reason, 'cancellation reason', 2000);
          if (body.cancellationConsent !== true)
            throw new Error(
              'Accept the 0.5% cancellation deduction and profile-bank refund terms.',
            );
          const settings = await getPlanSettings(tx);
          const requestedAt = new Date();
          const days = settings.refundBusinessDays ?? 7;
          const dueAt = refundDeadline(
            requestedAt,
            days,
            settings.refundHolidays ?? [],
          );
          await tx.$executeRaw`UPDATE vehicle_payment_plans SET previousStatus=status,status='CANCELLATION_REQUESTED',cancellationReason=${reason},cancellationRequestedAt=${requestedAt},refundDueAt=${dueAt},refundBusinessDays=${days},updatedAt=NOW(3) WHERE orderId=${id}`;
          await vehicleEvent(
            tx,
            id,
            'PLAN_CANCELLATION',
            `Cancellation requested. Payments and procurement are paused. Approved payments less 0.5% will be refunded within ${days} business days from this request, by ${dueAt.toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos' })}, to your Paystack-validated profile bank account. Please verify your profile bank details if needed; the deadline remains unchanged.`,
            auth.pidUser,
          );
        } else throw new Error('Unsupported action.');
      },
      { timeout: 30000 },
    );
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      {
        message: (e as { code?: string }).code
          ? 'Unable to update this plan. Please retry.'
          : (e as Error).message,
      },
      { status: 400 },
    );
  }
}
