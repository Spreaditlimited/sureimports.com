import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { recordWalletDebit } from '@/lib/walletLedger';
import {
  recordAffiliateConversion,
  AFFILIATE_SERVICE_KEYS,
} from '@/lib/affiliate/commissions';
import sendEmail from '@/lib/email/config/sendEmail';
import {
  resolvePublicAccount,
  sendPublicAccountSetupEmail,
} from '@/lib/auth/resolvePublicAccount';
import { shopGuestHash } from './auth';
import { claimAffiliateReferralByReference } from '@/lib/affiliate/attribution';
import {
  cartInput,
  checkoutInput,
  guestCheckoutInput,
  priceCart,
  ShopError,
  ShopItem,
  validateShopPayment,
} from './policy';

export async function quoteShopCart(input: unknown) {
  const items = cartInput.parse(input);
  const products = await prisma.store.findMany({
    where: { pidProduct: { in: items.map((item) => item.pidProduct) } },
  });
  return priceCart(items, products);
}

export async function createShopCheckout(
  pidUser: string,
  input: unknown,
  provider: 'PAYSTACK' | 'WALLET',
  guest = false,
  affiliateReferralReference?: string,
) {
  const guestBody = guest ? guestCheckoutInput.parse(input) : null;
  if (guest && provider !== 'PAYSTACK')
    throw new ShopError('Sign in to use your wallet.', 401);
  const body = guestBody || checkoutInput.parse(input);
  const guestTokenHash = guestBody ? shopGuestHash(guestBody.guestToken) : null;
  if (guestTokenHash) pidUser = `GUEST_${guestTokenHash}`;
  const requestHash = createHash('sha256')
    .update(
      JSON.stringify({
        provider,
        items: [...body.cartItems].sort((a, b) =>
          a.pidProduct.localeCompare(b.pidProduct),
        ),
        address: body.shippingAddress,
        total: body.totalAmount,
        ...(guestBody
          ? {
              contactName: guestBody.contactName,
              contactEmail: guestBody.contactEmail,
            }
          : {}),
      }),
    )
    .digest('hex');
  const existing = await prisma.shop_checkouts.findUnique({
    where: guestTokenHash
      ? {
          guestTokenHash_requestKey: {
            guestTokenHash,
            requestKey: body.requestKey,
          },
        }
      : { pidUser_requestKey: { pidUser, requestKey: body.requestKey } },
  });
  if (existing) {
    if (existing.requestHash !== requestHash)
      throw new ShopError(
        'This payment attempt belongs to a different cart. Refresh before starting a new order.',
        409,
      );
    return existing;
  }
  const quote = await quoteShopCart(body.cartItems);
  if (Math.round(body.totalAmount * 100) !== quote.amountMinor)
    throw new ShopError(
      'Prices have changed. Review the updated total and click pay again.',
      409,
      quote,
    );
  const user = guestBody
    ? null
    : await prisma.users.findUniqueOrThrow({ where: { pidUser } });
  try {
    return await prisma.shop_checkouts.create({
      data: {
        reference: `SHOP2_${randomUUID()}`,
        pidUser,
        guestTokenHash,
        affiliateReferralReference,
        requestKey: body.requestKey,
        requestHash,
        provider,
        email: guestBody?.contactEmail || user!.userEmail,
        customerName:
          guestBody?.contactName ||
          `${user!.userFirstname || ''} ${user!.userLastname || ''}`.trim(),
        shippingAddress: body.shippingAddress,
        items: quote.cart as unknown as Prisma.InputJsonValue,
        amountMinor: quote.amountMinor,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const concurrent = await prisma.shop_checkouts.findUniqueOrThrow({
        where: guestTokenHash
          ? {
              guestTokenHash_requestKey: {
                guestTokenHash,
                requestKey: body.requestKey,
              },
            }
          : { pidUser_requestKey: { pidUser, requestKey: body.requestKey } },
      });
      if (concurrent.requestHash !== requestHash)
        throw new ShopError('Please refresh your cart before continuing.', 409);
      return concurrent;
    }
    throw error;
  }
}

async function paystack(path: string, body?: unknown) {
  const key = process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY;
  if (!key)
    throw new ShopError(
      'Card payments are temporarily unavailable. Please try again later.',
      503,
    );
  const response = await fetch(`https://api.paystack.co/transaction/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok || !result.status)
    throw new ShopError(
      'We could not confirm the payment gateway response. Retry this attempt or contact support if you have been charged.',
      503,
    );
  return result.data;
}

export async function initializeShopPaystack(
  reference: string,
  origin: string,
  dashboard: boolean,
) {
  let checkout = await prisma.shop_checkouts.findUniqueOrThrow({
    where: { reference },
  });
  if (checkout.status === 'PAID' || checkout.authorizationUrl) return checkout;
  const claimed = await prisma.shop_checkouts.updateMany({
    where: { reference, initializationStartedAt: null },
    data: { initializationStartedAt: new Date() },
  });
  if (!claimed.count) {
    // An uncertain initialization must never silently create another reference.
    try {
      await verifyShopCheckout(reference);
    } catch {
      /* Retain the original attempt. */
    }
    checkout = await prisma.shop_checkouts.findUniqueOrThrow({
      where: { reference },
    });
    if (checkout.status === 'PAID' || checkout.authorizationUrl)
      return checkout;
    throw new ShopError(
      'This payment is still being prepared or checked. Retry shortly. If it persists, contact support with your order reference.',
      409,
      { reference },
    );
  }
  try {
    const result = await paystack('initialize', {
      email: checkout.email,
      amount: checkout.amountMinor,
      currency: 'NGN',
      reference,
      callback_url: `${origin}${dashboard ? '/dashboard' : ''}/shop/order-success?ref=${encodeURIComponent(reference)}`,
      metadata: {
        source: 'shop_v2',
        checkoutReference: reference,
        pidUser: checkout.pidUser,
      },
    });
    const url = new URL(result.authorization_url);
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'checkout.paystack.com' ||
      result.reference !== reference
    )
      throw new Error('Unexpected Paystack initialization response');
    return await prisma.shop_checkouts.update({
      where: { reference },
      data: {
        authorizationUrl: url.toString(),
        accessCode: result.access_code,
      },
    });
  } catch (error) {
    // Keep the reference reserved: a network timeout is not proof initialization failed.
    throw error;
  }
}

export async function finalizeShopCheckout(
  reference: string,
  payment?: unknown,
) {
  // Account creation happens only after a verified provider payment, never when a guest merely starts checkout.
  const snapshot = await prisma.shop_checkouts.findUnique({
    where: { reference },
  });
  let guestAccount: { pidUser: string; needsSetup: boolean } | null = null;
  if (snapshot?.guestTokenHash && snapshot.status !== 'PAID') {
    validateShopPayment(snapshot, payment);
    let user = await prisma.users.findUnique({
      where: { userEmail: snapshot.email },
    });
    if (!user) {
      const [firstName, ...rest] = snapshot.customerName.split(/\s+/);
      const resolved = await resolvePublicAccount({
        email: snapshot.email,
        firstName,
        lastName: rest.join(' '),
        country: 'Nigeria',
        accountSetupKey: `shop:${reference}`,
      });
      user =
        resolved.status === 'ready'
          ? resolved.user
          : await prisma.users.findUnique({
              where: { userEmail: snapshot.email },
            });
    }
    if (!user)
      throw new ShopError(
        'Payment received. We are still preparing your order; please check again shortly.',
        503,
      );
    guestAccount = {
      pidUser: user.pidUser,
      needsSetup:
        user.loginKey === `shop:${reference}` && Boolean(user.cidStatus),
    };
  }
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT reference FROM shop_checkouts WHERE reference=${reference} FOR UPDATE`;
      const checkout = await tx.shop_checkouts.findUnique({
        where: { reference },
      });
      if (!checkout) throw new ShopError('Order not found.', 404);
      if (payment !== undefined && checkout.provider !== 'PAYSTACK')
        throw new ShopError('Payment method does not match this order.', 409);
      if (checkout.provider === 'PAYSTACK')
        validateShopPayment(checkout, payment);
      if (checkout.status === 'PAID') return checkout;
      if (checkout.guestTokenHash) {
        if (!guestAccount)
          throw new ShopError('Please check this payment again shortly.', 503);
        checkout.pidUser = guestAccount.pidUser;
      }
      if (checkout.provider === 'WALLET') {
        const wallet = await tx.wallet.findUnique({
          where: { pidUser: checkout.pidUser },
        });
        if (!wallet || wallet.currency !== 'NGN')
          throw new ShopError('Please activate your Naira wallet first.');
        await tx.$queryRaw`SELECT id FROM Wallet WHERE id=${wallet.id} FOR UPDATE`;
        const locked = await tx.wallet.findUniqueOrThrow({
          where: { id: wallet.id },
        });
        if (Math.round(Number(locked.balance) * 100) < checkout.amountMinor)
          throw new ShopError(
            'Your wallet balance is insufficient for this order.',
            409,
          );
        const debitId = `DEB_${randomUUID()}`;
        await recordWalletDebit(
          tx,
          { pidUser: checkout.pidUser, userEmail: checkout.email },
          {
            amount: checkout.amountMinor / 100,
            reference: `DEBIT:${debitId}`,
            description: 'SureStore purchase',
            currency: 'NGN',
          },
        );
        await tx.debits.create({
          data: {
            pidDebit: debitId,
            pidUser: checkout.pidUser,
            email: checkout.email,
            payerName: checkout.customerName,
            txID: reference,
            txRef: reference,
            paymentStatus: 'DEBITED',
            amount: checkout.amountMinor / 100,
            currency: 'NGN',
          },
        });
      }
      await tx.payments.create({
        data: {
          pidPayment: `PAY_${randomUUID()}`,
          pidUser: checkout.pidUser,
          payerName: checkout.customerName,
          payerEmail: checkout.email,
          txID: reference,
          txRef: reference,
          paymentStatus: 'PAID',
          paymentType: checkout.provider,
          currency: 'NGN',
          amount: checkout.amountMinor / 100,
          serviceID: reference,
          serviceName: 'SHOP',
          serviceDescription: 'Online Shop Purchase',
          paymentExt1: checkout.shippingAddress,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      for (const item of checkout.items as unknown as ShopItem[]) {
        await tx.store_sales.create({
          data: {
            pidStore: `SALE_${randomUUID()}`,
            pidProduct: item.pidProduct,
            pidUser: checkout.pidUser,
            product_name: item.productName,
            unit_price: (item.unitMinor / 100).toFixed(2),
            total_price: ((item.unitMinor * item.quantity) / 100).toFixed(2),
            quantity: String(item.quantity),
            status: 'PAID',
            ext1: reference,
            ext2: checkout.provider,
          },
        });
      }
      return tx.shop_checkouts.update({
        where: { reference },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          ...(guestAccount
            ? {
                pidUser: guestAccount.pidUser,
                accountSetupRequired: guestAccount.needsSetup,
              }
            : {}),
        },
      });
    },
    { timeout: 15000 },
  );
}

export async function verifyShopCheckout(reference: string) {
  const checkout = await prisma.shop_checkouts.findUnique({
    where: { reference },
  });
  if (!checkout) throw new ShopError('Order not found.', 404);
  if (checkout.status === 'PAID' || checkout.provider === 'WALLET')
    return checkout;
  await prisma.shop_checkouts.update({
    where: { reference },
    data: { lastCheckedAt: new Date() },
  });
  const payment = await paystack(`verify/${encodeURIComponent(reference)}`);
  if (payment.status !== 'success') return checkout;
  return finalizeShopCheckout(reference, payment);
}

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

// Persisted retry flags isolate receipt/commission failures from payment success.
export async function processShopEffects(reference: string) {
  const lease = await prisma.shop_checkouts.updateMany({
    where: {
      reference,
      status: 'PAID',
      OR: [
        { effectsLeaseUntil: null },
        { effectsLeaseUntil: { lt: new Date() } },
      ],
    },
    data: { effectsLeaseUntil: new Date(Date.now() + 300000) },
  });
  if (!lease.count) return;
  try {
    const row = await prisma.shop_checkouts.findUniqueOrThrow({
      where: { reference },
    });
    const items = row.items as unknown as ShopItem[];
    if (row.accountSetupRequired && !row.accountSetupEmailSentAt) {
      try {
        const user = await prisma.users.findUniqueOrThrow({
          where: { pidUser: row.pidUser },
        });
        await sendPublicAccountSetupEmail({
          user,
          context: 'your shop purchase',
        });
        await prisma.shop_checkouts.update({
          where: { reference },
          data: { accountSetupEmailSentAt: new Date() },
        });
      } catch (error) {
        console.error('Shop account email will retry', { reference, error });
      }
    }
    if (!row.affiliateDoneAt) {
      try {
        if (row.affiliateReferralReference)
          await claimAffiliateReferralByReference(
            row.affiliateReferralReference,
            row.pidUser,
            row.email,
          );
        if (
          items.some((item) =>
            ['phone', 'laptop'].includes(item.productCategory.toLowerCase()),
          )
        )
          await recordAffiliateConversion({
            customerReference: row.pidUser,
            serviceKey: AFFILIATE_SERVICE_KEYS.PHONES_AND_LAPTOPS,
            externalOrderReference: `shop:${reference}`,
            externalPaymentReference: `${row.provider.toLowerCase()}:${reference}`,
            paymentCurrency: 'NGN',
            grossAmount: row.amountMinor / 100,
            eligibleAmount: row.amountMinor / 100,
          });
        await prisma.shop_checkouts.update({
          where: { reference },
          data: { affiliateDoneAt: new Date() },
        });
      } catch (error) {
        console.error('Shop commission will retry', { reference, error });
      }
    }
    const html = `<p>Order reference: ${escape(reference)}</p><ul>${items.map((item) => `<li>${escape(item.productName)} × ${item.quantity} — ₦${((item.unitMinor * item.quantity) / 100).toLocaleString('en-NG')}</li>`).join('')}</ul><p>Total paid: ₦${(row.amountMinor / 100).toLocaleString('en-NG')}</p><p>Delivery address: ${escape(row.shippingAddress)}</p><p>We will keep you updated as your order is processed and shipped to your delivery address.</p><p><a href="https://www.sureimports.com/dashboard/orders">View your orders</a></p>`;
    if (!row.customerEmailSentAt) {
      await sendEmail(
        row.email,
        'Your Sure Imports shop order is confirmed',
        html,
      );
      await prisma.shop_checkouts.update({
        where: { reference },
        data: { customerEmailSentAt: new Date() },
      });
    }
    if (!row.adminEmailSentAt) {
      await sendEmail(
        process.env.SHOP_ORDER_NOTIFICATION_EMAIL || 'hello@sureimports.com',
        'New paid shop order',
        `<p>${escape(row.customerName)} · ${escape(row.email)}</p>${html}`,
      );
      await prisma.shop_checkouts.update({
        where: { reference },
        data: { adminEmailSentAt: new Date() },
      });
    }
  } catch (error) {
    console.error('Shop post-payment work will retry', { reference, error });
  } finally {
    await prisma.shop_checkouts.update({
      where: { reference },
      data: { effectsLeaseUntil: null },
    });
  }
}
