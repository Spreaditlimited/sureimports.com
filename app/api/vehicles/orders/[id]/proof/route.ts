import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import { vehicleEvent, vehicleId } from '@/lib/vehicles/events';
import { sameOrigin, inputText } from '@/lib/vehicles/http';
import type { VehicleBank } from '@/lib/vehicles/customer';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await checkAuth();
  if (!auth)
    return Response.json({ message: 'Sign in to continue.' }, { status: 401 });
  try {
    sameOrigin(request);
    if (Number(request.headers.get('content-length')) > 4 * 1024 * 1024)
      throw new Error('Upload a receipt smaller than 3 MB.');
    const { id } = await params;
    const form = await request.formData();
    const file = form.get('proof');
    if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024)
      throw new Error('Upload a JPG, PNG or PDF receipt smaller than 3 MB.');
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime =
      buffer.subarray(0, 5).toString() === '%PDF-'
        ? 'application/pdf'
        : buffer
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? 'image/png'
          : buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255
            ? 'image/jpeg'
            : null;
    if (!mime)
      throw new Error('The receipt must be a valid JPG, PNG or PDF file.');
    const amountText = String(form.get('amount') || '');
    if (!/^\d{1,12}(\.\d{1,2})?$/.test(amountText) || Number(amountText) <= 0)
      throw new Error(
        'Enter the amount transferred, with at most two decimal places.',
      );
    const reference = inputText(
      form.get('reference'),
      'bank transaction reference',
      150,
    );
    const sender = inputText(form.get('sender'), 'sender name', 160);
    const bank = inputText(form.get('bank'), 'bank account', 191);
    const requestKey = createHash('sha256')
      .update(
        `${auth.pidUser}:${id}:${inputText(form.get('requestKey'), 'request key', 36)}`,
      )
      .digest('hex');
    await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM vehicle_orders WHERE id = ${id} FOR UPDATE`;
      const order = await tx.vehicle_orders.findFirst({
        where: { id, pidUser: auth.pidUser },
      });
      if (!order) throw new Error('Order not found.');
      if (await tx.vehicle_payment_proofs.findUnique({ where: { requestKey } }))
        return;
      if (!order.pidInvoice || order.status !== 'QUOTED')
        throw new Error('This order is not awaiting payment.');
      const invoices = await tx.$queryRaw<
        { balanceDue: string; status: string }[]
      >`SELECT balanceDue, status FROM invoices WHERE pidInvoice = ${order.pidInvoice} FOR UPDATE`;
      const invoice = invoices[0];
      if (!invoice || ['PAID', 'CANCELLED'].includes(invoice.status))
        throw new Error('This invoice is no longer awaiting payment.');
      if (Number(amountText) > Number(invoice.balanceDue))
        throw new Error(
          'The amount exceeds the outstanding balance. Contact our team to reconcile an overpayment.',
        );
      const duplicate = await tx.$queryRaw<
        { id: number }[]
      >`SELECT id FROM invoice_payment_claims WHERE pidInvoice = ${order.pidInvoice} AND paymentReference = ${reference} AND status IN ('PENDING_CONFIRMATION','APPROVED') LIMIT 1`;
      if (duplicate.length)
        throw new Error('This transaction reference is already submitted.');
      const pending = await tx.$queryRaw<
        { total: string }[]
      >`SELECT COALESCE(SUM(claimedAmount),0) AS total FROM invoice_payment_claims WHERE pidInvoice = ${order.pidInvoice} AND status = 'PENDING_CONFIRMATION'`;
      if (
        Number(pending[0].total) + Number(amountText) >
        Number(invoice.balanceDue)
      )
        throw new Error(
          'Your pending payments already cover this amount. Please wait for review.',
        );
      const banks = await tx.$queryRaw<
        VehicleBank[]
      >`SELECT pidBankAccount, accountName, bankName, accountNumber, notes FROM invoice_bank_accounts WHERE pidBankAccount = ${bank} AND status = 'ACTIVE' AND currency = 'NGN' AND (LOWER(country) = 'nigeria' OR UPPER(country) = 'NG')`;
      if (!banks[0])
        throw new Error('Choose an active Nigerian Naira bank account.');
      const claimId = vehicleId('VC');
      const bankJson = JSON.stringify(banks[0]);
      const late = !!order.quoteExpiresAt && order.quoteExpiresAt < new Date();
      const note = `Sender: ${sender}. ${late ? 'Submitted after quote expiry; finance must reconcile with the original quotation.' : ''}`;
      await tx.$executeRaw`INSERT INTO invoice_payment_claims (pidClaim,pidInvoice,pidUser,claimedAmount,currency,selectedBankAccountId,selectedBankAccountJson,paymentReference,note,claimedAt,status,createdAt,updatedAt) VALUES (${claimId},${order.pidInvoice},${auth.pidUser},${amountText},'NGN',${bank},${bankJson},${reference},${note},NOW(),'PENDING_CONFIRMATION',NOW(),NOW())`;
      await tx.vehicle_payment_proofs.create({
        data: {
          id: vehicleId('VP'),
          orderId: id,
          claimId,
          requestKey,
          filename: `payment-proof.${mime === 'application/pdf' ? 'pdf' : mime === 'image/png' ? 'png' : 'jpg'}`,
          mime,
          content: buffer,
        },
      });
      await vehicleEvent(
        tx,
        id,
        'PAYMENT_SUBMITTED',
        'Your payment proof has been received. Our finance team will confirm the bank credit and update your balance.',
        auth.pidUser,
      );
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      {
        message: (e as { code?: string }).code
          ? 'Payment submission is temporarily unavailable. Please try again.'
          : (e as Error).message,
      },
      { status: 400 },
    );
  }
}
