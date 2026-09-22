import { z } from 'zod';

export class ShopError extends Error {
  constructor(
    message: string,
    public status = 400,
    public data?: unknown,
  ) {
    super(message);
  }
}

export const cartInput = z
  .array(
    z.object({
      pidProduct: z.string().trim().min(1).max(100),
      quantity: z.number().int().min(1).max(999),
    }),
  )
  .min(1)
  .max(100)
  .superRefine((items, ctx) => {
    if (new Set(items.map((item) => item.pidProduct)).size !== items.length)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each product must appear only once.',
      });
  });

export const checkoutInput = z.object({
  cartItems: cartInput,
  shippingAddress: z.string().trim().min(10).max(2000),
  requestKey: z.string().uuid(),
  totalAmount: z.number().finite().positive(),
});

export const guestCheckoutInput = checkoutInput.extend({
  contactName: z.string().trim().min(1).max(191),
  contactEmail: z
    .string()
    .trim()
    .email()
    .max(191)
    .transform((value) => value.toLowerCase()),
  guestToken: z.string().regex(/^[a-f0-9]{64}$/),
});

export type ShopItem = {
  pidProduct: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productCategory: string;
  quantity: number;
  unitMinor: number;
};
type Product = {
  pidProduct: string;
  productName: string | null;
  productPrice: number | null;
  productVisibility: boolean | null;
  productStatus: string | null;
  productMOQ: number | null;
  productImage: string | null;
  productCategory: string | null;
};

export function priceCart(
  items: z.infer<typeof cartInput>,
  products: Product[],
) {
  const cart: ShopItem[] = items.map((item) => {
    const product = products.find((p) => p.pidProduct === item.pidProduct);
    if (
      !product?.productVisibility ||
      (product.productStatus != null &&
        product.productStatus.trim() !== '' &&
        product.productStatus.toLowerCase() !== 'available')
    )
      throw new ShopError(
        'An item is no longer available. Remove it from your cart before continuing.',
        409,
      );
    if (item.quantity < Math.max(1, Math.ceil(product.productMOQ || 1)))
      throw new ShopError(
        `${product.productName}: minimum quantity is ${Math.ceil(product.productMOQ || 1)}.`,
        409,
      );
    const unitMinor = Math.round(Number(product.productPrice) * 100);
    if (!Number.isSafeInteger(unitMinor) || unitMinor <= 0)
      throw new ShopError(
        'An item cannot be purchased right now. Please contact support.',
        409,
      );
    return {
      ...item,
      unitMinor,
      productPrice: unitMinor / 100,
      productName: product.productName || 'Product',
      productImage: product.productImage || '',
      productCategory: product.productCategory || '',
    };
  });
  const amountMinor = cart.reduce(
    (sum, item) => sum + item.unitMinor * item.quantity,
    0,
  );
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0)
    throw new ShopError('Please reduce the order quantity.');
  return { cart, amountMinor, totalAmount: amountMinor / 100 };
}

export function validateShopPayment(
  checkout: {
    reference: string;
    pidUser: string;
    email: string;
    amountMinor: number;
    provider: string;
    guestTokenHash?: string | null;
  },
  payment: any,
) {
  const metadata =
    typeof payment?.metadata === 'string'
      ? JSON.parse(payment.metadata)
      : payment?.metadata;
  if (
    checkout.provider !== 'PAYSTACK' ||
    payment?.status !== 'success' ||
    payment.reference !== checkout.reference ||
    payment.currency !== 'NGN' ||
    Number(payment.amount) !== checkout.amountMinor ||
    metadata?.source !== 'shop_v2' ||
    metadata?.checkoutReference !== checkout.reference ||
    metadata?.pidUser !==
      (checkout.guestTokenHash
        ? `GUEST_${checkout.guestTokenHash}`
        : checkout.pidUser) ||
    String(payment.customer?.email || '').toLowerCase() !==
      checkout.email.toLowerCase()
  )
    throw new ShopError(
      'Payment could not be matched to this order. Please contact support with your reference.',
      409,
    );
}
