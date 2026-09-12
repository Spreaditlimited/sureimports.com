import { creditWallet } from './wallet';
import 'server-only';
import { createHmac, hkdfSync, randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { encryptKyc, decryptKyc } from './kyc-crypto';
import {
  customerOrderSchema,
  partnerReleaseBlockReason,
} from './customer-order-policy';
import {
  priceCustomerOrder,
  checkoutTotal,
  verifiedReceiptMatches,
  type CustomerOrderCost,
} from './order-cost';
import { resolveNewProcurementShippingPricing } from '@/lib/procurement/shippingPricing';
import { partnerCollectionBlockReason } from './policy';
import { customerProcessingFee } from './processing-fee';
import { ProcurementRequestError as FlowError } from './procurement-request-policy';

type Row = {
  id: string;
  partnerId: string;
  customerPidUser: string;
  status: string;
  revision: number;
  paymentStatus: string;
  verifiedPaymentReference: string | null;
  paidRevision: number | null;
  partnerReview: string;
  releasedOrderId: string | null;
  detailsCiphertext: string;
  checkoutReference: string | null;
  checkoutCiphertext: string | null;
};
type Checkout = {
  cost: CustomerOrderCost;
  processingFeeMinor: number;
  totalMinor: number;
  reference: string;
  revision: number;
  domain: 'live';
  subaccount?: string;
  settlementPolicy?: 'EARNINGS_WALLET';
  callbackHost: string;
  url?: string;
};
const seal = (
  value: unknown,
  row: Pick<Row, 'id' | 'partnerId'>,
  purpose = 'customer-order',
) =>
  encryptKyc(
    Buffer.from(JSON.stringify(value)),
    `${purpose}:${row.partnerId}:${row.id}`,
  ).toString('base64');
const unseal = (
  value: string,
  row: Pick<Row, 'id' | 'partnerId'>,
  purpose = 'customer-order',
) =>
  JSON.parse(
    decryptKyc(
      Buffer.from(value, 'base64'),
      `${purpose}:${row.partnerId}:${row.id}`,
    ).toString('utf8'),
  );
async function event(
  tx: Prisma.TransactionClient,
  row: Row,
  actor: string,
  action: string,
) {
  await tx.$executeRaw`INSERT INTO procurement_partner_order_events (id, customerOrderId, actorPid, action) VALUES (${randomUUID()}, ${row.id}, ${actor}, ${action})`;
}
async function lockOrder(tx: Prisma.TransactionClient, id: string) {
  const [row] = await tx.$queryRaw<
    Row[]
  >`SELECT * FROM procurement_partner_customer_orders WHERE id = ${id} FOR UPDATE`;
  if (!row) throw new FlowError('Order not found.', 404);
  return row;
}
async function business(tx: Prisma.TransactionClient, partnerId: string) {
  await tx.$queryRaw`SELECT id FROM procurement_partners WHERE id = ${partnerId} FOR UPDATE`;
  await tx.$queryRaw`SELECT partnerId FROM procurement_partner_kyc WHERE partnerId = ${partnerId} FOR UPDATE`;
  const p = await tx.procurement_partners.findUnique({
    where: { id: partnerId },
    include: {
      storefront: true,
      domains: true,
      kyc: { select: { status: true } },
    },
  });
  if (
    !p ||
    p.status !== 'ACTIVE' ||
    !p.approvedAt ||
    p.country !== 'NG' ||
    p.settlementCurrency !== 'NGN' ||
    p.kyc?.status !== 'VERIFIED'
  )
    throw new FlowError('Business approval requires review.', 403);
  const owner = await tx.users.findUnique({
    where: { pidUser: p.ownerPidUser },
    select: { userEmail: true },
  });
  const master = Buffer.from(
    process.env.AFFILIATE_SECURITY_KEY || '',
    'base64',
  );
  if (!owner?.userEmail || master.length !== 32)
    throw new FlowError('Business membership is unavailable.', 403);
  const key = Buffer.from(
    hkdfSync('sha256', master, Buffer.alloc(0), 'affiliate-email-v1', 32),
  );
  const hash = createHmac('sha256', key)
    .update(owner.userEmail.trim().toLowerCase())
    .digest('hex');
  const [membership] = await tx.$queryRaw<
    Array<{ program: string; subjectId: string }>
  >`SELECT program, subjectId FROM commercial_program_memberships WHERE emailHash = ${hash} FOR UPDATE`;
  if (
    membership?.program !== 'PARTNER' ||
    membership.subjectId !== `partner:${p.id}`
  )
    throw new FlowError('Business membership requires review.', 403);
  return p;
}
async function currentCost(row: Row) {
  const input = customerOrderSchema.parse(
    unseal(row.detailsCiphertext, row).input,
  );
  const [shipping, financial, partner] = await Promise.all([
    resolveNewProcurementShippingPricing(
      input.destinationCountry,
      input.shippingPlan,
    ),
    prisma.exchange_rate.findUnique({ where: { id: 1 } }),
    prisma.procurement_partners.findUnique({ where: { id: row.partnerId } }),
  ]);
  if (!financial || !partner)
    throw new FlowError('Pricing configuration is unavailable.', 503);
  return priceCustomerOrder(input, shipping, {
    ngnPerUsd: Number(financial.exNairaToDollar),
    cnyPerUsd: Number(financial.exYuanToDollar),
    ngnPerCny: Number(financial.exNairaToYuan),
    productPricingVersion: 2,
    vatPercent: Number(financial.vat),
    minimumOrderNgn: Number(financial.procurementMinimumOrderNgn),
    serviceChargeBps: partner.serviceChargeBps,
    partnerShareBps: partner.partnerShareBps,
  });
}
export async function customerOrderDetail(
  slug: string,
  customerPid: string,
  id: string,
) {
  const [row] = await prisma.$queryRaw<
    Row[]
  >`SELECT o.* FROM procurement_partner_customer_orders o INNER JOIN procurement_partners p ON p.id = o.partnerId WHERE o.id = ${id} AND o.customerPidUser = ${customerPid} AND p.slug = ${slug}`;
  if (!row) throw new FlowError('Order not found.', 404);
  const paid = row.checkoutCiphertext
    ? (unseal(row.checkoutCiphertext, row, 'customer-checkout') as Checkout)
    : null;
  const cost = paid?.cost || (await currentCost(row));
  const operational = row.releasedOrderId
    ? await prisma.orders.findUnique({
        where: { pidOrder: row.releasedOrderId },
        select: { status: true, trackingNumber: true, trackingCompany: true },
      })
    : null;
  // Never expose partner earning allocations or internal receiving addresses to customers.
  const [receipt] = await prisma.$queryRaw<Array<{ deliveryConfirmedAt: Date | null; state: string }>>`SELECT deliveryConfirmedAt,state FROM partner_wallet_credits WHERE orderId=${id}`;
  return {
    id: row.id,
    receiptConfirmedAt: receipt?.deliveryConfirmedAt?.toISOString() || null,
    canConfirmReceipt: Boolean(receipt?.state === 'PENDING' && !receipt.deliveryConfirmedAt && operational?.status === 'completed' && row.paymentStatus === 'PAID'),
    revision: row.revision,
    status: operational?.status || row.status,
    paymentStatus: row.paymentStatus,
    partnerReview: row.partnerReview,
    input: customerOrderSchema.parse(unseal(row.detailsCiphertext, row).input),
    tracking: operational,
    cost: {
      productCostMinor: cost.productCostMinor,
      shippingMinor: cost.shippingMinor,
      serviceChargeMinor: cost.serviceChargeMinor,
      taxMinor: cost.taxMinor,
      orderTotalMinor: cost.orderTotalMinor,
      minimumOrderNgn: cost.minimumOrderNgn,
      meetsMinimum: cost.meetsMinimum,
    },
    shipping: cost.shipping,
    rates: {
      ngnPerUsd: cost.config.ngnPerUsd,
      cnyPerUsd: cost.config.cnyPerUsd,
      ngnPerCny: cost.config.ngnPerCny || 0,
      directRmbToNgn: cost.config.productPricingVersion === 2,
    },
    processingFeeMinor:
      paid?.processingFeeMinor ??
      (cost.orderTotalMinor > 0
        ? customerProcessingFee(cost.orderTotalMinor)
        : 0),
    paymentTotalMinor:
      paid?.totalMinor ??
      checkoutTotal(
        cost,
        cost.orderTotalMinor > 0
          ? customerProcessingFee(cost.orderTotalMinor)
          : 0,
      ),
    checkoutUrl: row.paymentStatus === 'INITIALIZED' ? paid?.url || null : null,
  };
}
export async function editCustomerOrder(
  slug: string,
  customerPid: string,
  id: string,
  revision: number,
  raw: unknown,
) {
  const parsed = customerOrderSchema.safeParse(raw);
  if (!parsed.success) throw new FlowError('Check your product details.', 422);
  const shipping = await resolveNewProcurementShippingPricing(
    parsed.data.destinationCountry,
    parsed.data.shippingPlan,
  );
  if (shipping.countryName.toLowerCase() !== 'nigeria')
    throw new FlowError('Nigeria only.', 422);
  return prisma.$transaction(async (tx) => {
    const row = await lockOrder(tx, id);
    const p = await business(tx, row.partnerId);
    if (row.customerPidUser !== customerPid || p.slug !== slug)
      throw new FlowError('Order not found.', 404);
    if (
      row.revision !== revision ||
      row.status !== 'saved' ||
      row.paymentStatus !== 'UNPAID'
    )
      throw new FlowError(
        'This order changed or payment has started. Refresh before editing.',
        409,
      );
    const details = unseal(row.detailsCiphertext, row);
    const encrypted = seal({ ...details, input: parsed.data, shipping }, row);
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET detailsCiphertext = ${encrypted}, revision = revision + 1, updatedAt = NOW(3) WHERE id = ${id}`;
    await event(tx, row, customerPid, 'CUSTOMER_EDITED');
    return { id, revision: revision + 1 };
  });
}
export async function cancelCustomerDraft(
  slug: string,
  customerPid: string,
  id: string,
  revision: number,
) {
  return prisma.$transaction(async (tx) => {
    const row = await lockOrder(tx, id);
    const p = await business(tx, row.partnerId);
    if (row.customerPidUser !== customerPid || p.slug !== slug)
      throw new FlowError('Order not found.', 404);
    if (
      row.status !== 'saved' ||
      row.revision !== revision ||
      row.paymentStatus !== 'UNPAID' ||
      row.checkoutReference ||
      row.verifiedPaymentReference ||
      row.releasedOrderId
    )
      throw new FlowError(
        'Only an unpaid saved order can be cancelled. Refresh the order first.',
        409,
      );
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET status = 'cancelled', revision = revision + 1, updatedAt = NOW(3) WHERE id = ${id}`;
    await event(tx, row, customerPid, 'CUSTOMER_CANCELLED_DRAFT');
    return { id, status: 'cancelled', revision: revision + 1 };
  });
}
export async function initiateCustomerCheckout(
  slug: string,
  customerPid: string,
  id: string,
  revision: number,
  acceptedTotalMinor: number,
) {
  const key = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY || '';
  if (!key.startsWith('sk_live_'))
    throw new FlowError(
      'Live collection is not configured. Test payments cannot enter the live ledger.',
      503,
    );
  // Persist before contacting Paystack. A timeout must never create a second payable reference.
  const intent = await prisma.$transaction(async (tx) => {
    const row = await lockOrder(tx, id);
    const p = await business(tx, row.partnerId);
    if (row.customerPidUser !== customerPid || p.slug !== slug)
      throw new FlowError('Order not found.', 404);
    if (row.revision !== revision || row.status !== 'saved')
      throw new FlowError('Refresh the order before paying.', 409);
    const block = partnerCollectionBlockReason(p);
    if (block)
      throw new FlowError(
        'Checkout is not enabled for this business yet. Your order remains saved.',
        409,
      );
    const domain = p.domains.find(
      (d) =>
        d.primary &&
        d.status === 'READY' &&
        d.verifiedAt &&
        d.readyAt &&
        !d.disconnectedAt &&
        (!d.expiresAt || d.expiresAt > new Date()),
    );
    if (
      !domain ||
      !p.storefront?.published ||
      !p.storefront.receivingAddress ||
      customerPid === p.ownerPidUser
    )
      throw new FlowError('Checkout is unavailable for this order.', 403);
    const customer = await tx.users.findUnique({
      where: { pidUser: customerPid },
      select: { userEmail: true },
    });
    if (!customer?.userEmail)
      throw new FlowError('Customer email is required.', 409);
    if (row.paymentStatus === 'INITIALIZED' && row.checkoutCiphertext)
      return {
        row,
        email: customer.userEmail,
        checkout: unseal(
          row.checkoutCiphertext,
          row,
          'customer-checkout',
        ) as Checkout,
      };
    if (row.paymentStatus !== 'UNPAID')
      throw new FlowError('Payment requires reconciliation.', 409);
    const cost = await currentCost(row);
    if (!cost.meetsMinimum)
      throw new FlowError('Your order is below the minimum order amount.', 422);
    const processingFeeMinor = customerProcessingFee(cost.orderTotalMinor);
    if (acceptedTotalMinor !== checkoutTotal(cost, processingFeeMinor))
      throw new FlowError(
        'Pricing changed. Reopen your order to review the new total before paying.',
        409,
      );
    const checkout: Checkout = {
      cost,
      processingFeeMinor,
      totalMinor: checkoutTotal(cost, processingFeeMinor),
      reference: `PCO_${randomUUID()}`,
      revision,
      domain: 'live',
      settlementPolicy: 'EARNINGS_WALLET',
      callbackHost: domain.hostname,
    };
    const encrypted = seal(checkout, row, 'customer-checkout');
    // Lock the receiving and commercial snapshots to the configuration used at checkout.
    const details = unseal(row.detailsCiphertext, row);
    const orderDetails = seal(
      {
        ...details,
        receivingAddress: p.storefront.receivingAddress,
        pricingRevision: p.pricingRevision,
      },
      row,
    );
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET checkoutReference = ${checkout.reference}, checkoutCiphertext = ${encrypted}, detailsCiphertext = ${orderDetails}, paymentStatus = 'INITIALIZED', updatedAt = NOW(3) WHERE id = ${id}`;
    await event(tx, row, customerPid, 'CHECKOUT_INITIALIZED');
    return { row, email: customer.userEmail, checkout };
  });
  if (intent.checkout.settlementPolicy !== 'EARNINGS_WALLET' || intent.checkout.subaccount) throw new FlowError('This older checkout uses a different settlement arrangement. Contact support before making payment.', 409);
  if (intent.checkout.url) return { url: intent.checkout.url };
  const checkout = intent.checkout;
  if (!checkout.callbackHost)
    throw new FlowError(
      'This earlier checkout requires reconciliation before retrying.',
      409,
    );
  const response = await fetch(
    'https://api.paystack.co/transaction/initialize',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        email: intent.email,
        amount: checkout.totalMinor,
        currency: 'NGN',
        reference: checkout.reference,
        channels: ['bank', 'ussd'],
        callback_url: `https://${checkout.callbackHost}/dashboard`,
        metadata: {
          partnerCustomerOrderId: id,
          partnerId: intent.row.partnerId,
          revision,
          settlementPolicy: 'EARNINGS_WALLET',
        },
      }),
    },
  );
  const result = await response.json();
  if (
    !response.ok ||
    result.status !== true ||
    result.data?.reference !== checkout.reference ||
    typeof result.data?.authorization_url !== 'string' ||
    new URL(result.data.authorization_url).origin !==
      'https://checkout.paystack.com'
  )
    throw new FlowError(
      'Paystack could not open checkout. Your payment reference is preserved; contact support if retrying does not resolve it.',
      503,
    );
  checkout.url = result.data.authorization_url;
  await prisma.$transaction(async (tx) => {
    const row = await lockOrder(tx, id);
    if (
      row.checkoutReference !== checkout.reference ||
      row.revision !== revision
    )
      throw new FlowError('Payment intent changed.', 409);
    const encrypted = seal(checkout, row, 'customer-checkout');
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET checkoutCiphertext = ${encrypted}, updatedAt = NOW(3) WHERE id = ${id}`;
  });
  return { url: checkout.url };
}

export async function customerPaymentReference(
  slug: string,
  customerPid: string,
  id: string,
) {
  const [row] = await prisma.$queryRaw<
    Array<{ checkoutReference: string | null }>
  >`SELECT o.checkoutReference FROM procurement_partner_customer_orders o JOIN procurement_partners p ON p.id = o.partnerId WHERE o.id = ${id} AND o.customerPidUser = ${customerPid} AND p.slug = ${slug}`;
  if (!row?.checkoutReference)
    throw new FlowError('Payment intent not found.', 404);
  return row.checkoutReference;
}

/** Called only after server-to-server Paystack verification, never from browser payment fields. */
export async function commitVerifiedCustomerPayment(
  reference: string,
  verified: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    domain: string;
    orderId: string;
    transactionId: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const [row] = await tx.$queryRaw<
      Row[]
    >`SELECT * FROM procurement_partner_customer_orders WHERE checkoutReference = ${reference} FOR UPDATE`;
    if (!row?.checkoutCiphertext)
      throw new FlowError('Payment intent not found.', 404);
    const checkout = unseal(
      row.checkoutCiphertext,
      row,
      'customer-checkout',
    ) as Checkout;
    if (
      !/^\d+$/.test(verified.transactionId) ||
      !verifiedReceiptMatches(verified, {
        reference,
        amount: checkoutTotal(checkout.cost, checkout.processingFeeMinor),
        orderId: row.id,
        domain: checkout.domain,
      }) ||
      checkout.totalMinor !== verified.amount ||
      checkout.revision !== row.revision
    )
      throw new FlowError('Payment does not match the frozen order.', 409);
    if (
      row.paymentStatus === 'PAID' &&
      row.verifiedPaymentReference === reference
    )
      return { id: row.id, duplicate: true };
    if (row.paymentStatus !== 'INITIALIZED' || row.status !== 'saved')
      throw new FlowError('Payment requires reconciliation.', 409);
    const customer = await tx.users.findUnique({
      where: { pidUser: row.customerPidUser },
      select: { userFirstname: true, userLastname: true, userEmail: true },
    });
    if (!customer) throw new FlowError('Customer record unavailable.', 409);
    const previous = await tx.payments.findFirst({
      where: { txRef: reference },
    });
    if (previous)
      throw new FlowError(
        'Payment reference already exists and requires reconciliation.',
        409,
      );
    await tx.payments.create({
      data: {
        pidPayment: `PPAY_${randomUUID()}`,
        pidUser: row.customerPidUser,
        payerName:
          `${customer.userFirstname || ''} ${customer.userLastname || ''}`.trim() ||
          'Customer',
        payerEmail: customer.userEmail,
        txID: verified.transactionId,
        txRef: reference,
        paymentStatus: 'PAID',
        paymentType: 'PAYSTACK',
        currency: 'NGN',
        amount: verified.amount / 100,
        serviceID: row.id,
        serviceName: 'PARTNER_PROCUREMENT',
        serviceDescription: 'Customer payment awaiting partner approval',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET status = 'pending', paymentStatus = 'PAID', verifiedPaymentReference = ${reference}, paidRevision = revision, partnerReview = 'AWAITING_REVIEW', updatedAt = NOW(3) WHERE id = ${row.id}`;
    if (checkout.settlementPolicy === 'EARNINGS_WALLET' && !checkout.subaccount) await creditWallet(tx, row.partnerId, row.id, checkout.cost.partnerEarningsMinor);
    await event(tx, row, 'PAYSTACK_VERIFIED', 'PAYMENT_CONFIRMED');
    return { id: row.id, duplicate: false };
  });
}
export async function approveCustomerOrder(
  ownerPid: string,
  id: string,
  revision: number,
) {
  return prisma.$transaction(async (tx) => {
    const row = await lockOrder(tx, id);
    const p = await business(tx, row.partnerId);
    if (p.ownerPidUser !== ownerPid)
      throw new FlowError('Order not found.', 404);
    if (row.revision !== revision)
      throw new FlowError('Order changed. Refresh before approval.', 409);
    if (row.releasedOrderId)
      return {
        id: row.id,
        releasedOrderId: row.releasedOrderId,
        duplicate: true,
      };
    if (
      !row.checkoutCiphertext ||
      partnerReleaseBlockReason({ ...row, partnerReview: 'APPROVED' })
    )
      throw new FlowError(
        'Confirmed payment for this order revision is required before approval.',
        409,
      );
    if (row.partnerReview !== 'AWAITING_REVIEW')
      throw new FlowError('Order is not awaiting review.', 409);
    const checkout = unseal(
      row.checkoutCiphertext,
      row,
      'customer-checkout',
    ) as Checkout;
    const payment = await tx.payments.findFirst({
      where: {
        txRef: row.verifiedPaymentReference!,
        serviceID: row.id,
        pidUser: row.customerPidUser,
        paymentStatus: 'PAID',
        currency: 'NGN',
        serviceName: 'PARTNER_PROCUREMENT',
      },
    });
    if (!payment || Math.round(payment.amount * 100) !== checkout.totalMinor)
      throw new FlowError('Payment ledger reconciliation is required.', 409);
    const details = unseal(row.detailsCiphertext, row);
    const input = customerOrderSchema.parse(details.input);
    const cost = checkout.cost;
    // The SI operational customer is the partner; their customer's identity stays in the tenant order.
    await tx.orders.create({
      data: {
        pidOrder: row.id,
        pidUser: p.ownerPidUser,
        orderName: input.orderName,
        destinationCountry: input.destinationCountry,
        currencyType: input.currencyType,
        shippingPlan: input.shippingPlan,
        orderCategory: input.orderCategory || 'PARTNER_PROCUREMENT',
        orderType: 'PARTNER_PROCUREMENT',
        shippingAddress: String(details.receivingAddress),
        status: 'pending',
        shippingPricingVersion: 2,
        shippingMeasurementUnit: cost.shipping.measurementUnit,
        shippingRateSnapshot: cost.shipping.rate,
        shippingRateCurrency: cost.shipping.rateCurrency,
        orderTotalCost: String(
          cost.orderTotalMinor / 100 / cost.config.ngnPerUsd,
        ),
        orderShippingCost: String(
          cost.shippingMinor / 100 / cost.config.ngnPerUsd,
        ),
        orderWeight: String(cost.measurement),
        vat: String(cost.config.vatPercent),
        serviceCharge: String(cost.serviceChargeBps / 100),
        exchangeRate1: String(cost.config.ngnPerUsd),
        exchangeRate2: String(cost.config.cnyPerUsd),
        exchangeRate3: String(cost.config.ngnPerCny || 0),
        productPricingVersion: cost.config.productPricingVersion ?? 1,
        updatedAt: new Date(),
      },
    });
    await tx.products.createMany({
      data: input.products.map((product) => ({
        ...product,
        pidProduct: `PPR_${randomUUID()}`,
        pidOrder: row.id,
        pidUser: p.ownerPidUser,
        updatedAt: new Date(),
      })),
    });
    await tx.procurement_partner_orders.create({
      data: {
        pidOrder: row.id,
        partnerId: p.id,
        source: 'STOREFRONT',
        externalReference: row.id,
        currency: 'NGN',
        pricingRevision: Number(details.pricingRevision),
        serviceChargeBps: cost.serviceChargeBps,
        partnerShareBps: cost.partnerShareBps,
        productCostMinor: BigInt(cost.productCostMinor),
        serviceChargeMinor: BigInt(cost.serviceChargeMinor),
        partnerEarningsMinor: BigInt(cost.partnerEarningsMinor),
        sureImportsServiceMinor: BigInt(cost.sureImportsServiceMinor),
        shippingMinor: BigInt(cost.shippingMinor),
        taxMinor: BigInt(cost.taxMinor),
        otherChargesMinor: BigInt(cost.otherChargesMinor),
        orderTotalMinor: BigInt(cost.orderTotalMinor),
        partnerReceivingAddress: String(details.receivingAddress),
      },
    });
    await tx.$executeRaw`UPDATE procurement_partner_customer_orders SET partnerReview = 'APPROVED', approvedAt = NOW(3), releasedOrderId = ${row.id}, updatedAt = NOW(3) WHERE id = ${row.id}`;
    await event(tx, row, ownerPid, 'PARTNER_APPROVED_RELEASED');
    return { id: row.id, releasedOrderId: row.id, duplicate: false };
  });
}
