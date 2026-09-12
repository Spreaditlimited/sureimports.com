import { z } from 'zod';

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
export function isChineseProductLink(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      [
        '1688.com',
        'taobao.com',
        'tmall.com',
        'alibaba.com',
        'aliexpress.com',
        'jd.com',
        'yangkeduo.com',
        'pinduoduo.com',
      ].some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
}
export const procurementRequestSchema = z
  .object({
    reference: text(3, 80).regex(
      /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/,
      'Use letters, numbers, dots, hyphens or underscores.',
    ),
    title: text(3, 120),
    shipping: z.enum(['AIR', 'SEA', 'ADVISE']),
    products: z
      .array(
        z
          .object({
            link: text(8, 2000).refine(
              isChineseProductLink,
              'Use an HTTPS product link from a supported Chinese marketplace.',
            ),
            name: text(2, 120),
            quantity: z.number().int().min(1).max(100000),
            specifications: text(2, 1500),
          })
          .strict(),
      )
      .min(1)
      .max(20),
    notes: z.string().trim().max(2000).default(''),
  })
  .strict();
export type ProcurementRequestInput = z.infer<typeof procurementRequestSchema>;
export const requestKeySchema = z.string().regex(/^[a-zA-Z0-9_-]{16,100}$/);

export class ProcurementRequestError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
