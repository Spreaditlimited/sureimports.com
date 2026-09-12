import { z } from 'zod';
import { isChineseProductLink } from './procurement-request-policy';

// Preserve the existing Sure Imports procurement statuses. Partner review is a separate gate.
export const customerOrderStages = ['saved', 'pending', 'approved', 'on-hold', 'pay-for-shipping', 'in-transit', 'ready-for-pickup', 'completed', 'cancelled'] as const;
export const customerOrderSchema = z.object({
  orderName: z.string().trim().min(3).max(120),
  destinationCountry: z.string().min(1).max(191),
  shippingPlan: z.string().min(1).max(191),
  currencyType: z.enum(['CNY', 'USD', 'NGN']),
  orderCategory: z.enum(['Goods with Battery', 'Raw Batteries', 'Liquids, Gases, Powder', 'Other Goods']).optional(),
  customerDeliveryAddress: z.string().trim().max(1500).optional(),
  products: z.array(z.object({
    productName: z.string().trim().min(2).max(120),
    productLink: z.string().trim().max(2000).refine(isChineseProductLink, 'Enter a supported Chinese marketplace HTTPS link.'),
    productPrice: z.number().finite().positive().max(10000000),
    productQuantity: z.number().int().min(1).max(100000),
    shippingMeasurePerUnit: z.number().finite().positive().max(100000),
    productInfo: z.string().trim().min(2).max(1500),
  }).strict()).max(50),
}).strict();
export type CustomerOrderInput = z.infer<typeof customerOrderSchema>;
export function partnerReleaseBlockReason(input: { status: string; paymentStatus: string; verifiedPaymentReference: string | null; partnerReview: string; revision: number; paidRevision: number | null }) {
  if (input.status !== 'pending') return 'ORDER_NOT_PENDING';
  if (input.paymentStatus !== 'PAID' || !input.verifiedPaymentReference || input.paidRevision !== input.revision) return 'PAYMENT_NOT_CONFIRMED';
  if (input.partnerReview !== 'APPROVED') return 'PARTNER_APPROVAL_REQUIRED';
  return null;
}
