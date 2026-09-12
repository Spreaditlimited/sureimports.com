import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

globalThis.__paystackRouting = [];
const inline = source => ({ url: `data:text/javascript,${encodeURIComponent(source)}`, shortCircuit: true });
const hook = registerHooks({ resolve(s, c, next) {
  if (s === 'next/server') return inline('export const NextResponse=Response');
  if (s.endsWith('intelligence/paystack-webhook/route')) return inline('export async function POST(r){globalThis.__paystackRouting.push({handler:"sureimports",body:await r.text(),signature:r.headers.get("x-paystack-signature")});return Response.json({received:true})}');
  if (s === '@/lib/partners/paystack-order-events') return inline('export async function handlePartnerPaystackEvent(body,signature){globalThis.__paystackRouting.push({handler:"partner",body,signature});return Response.json({received:true})}');
  if (s === '@/lib/partners/wallet') return inline('export class WalletError extends Error{};export async function walletTransferWebhook(body,signature){globalThis.__paystackRouting.push({handler:"wallet",body,signature});return {received:true}}');
  return next(s, c);
} });
const { POST } = await import('../app/api/webhooks/paystack/route.ts');
hook.deregister();

test('regular Sure Imports charges and affiliate transfers retain the existing handler and exact signed body', async () => {
  for (const reference of ['PROCPAY_12345', 'PAY12345', 'AFFPAYOUT_12345']) {
    const body = JSON.stringify({ event: reference.startsWith('AFF') ? 'transfer.success' : 'charge.success', data: { reference } });
    const response = await POST(new Request('https://sureimports.test/api/webhooks/paystack', {method:'POST',headers:{'x-paystack-signature':'unchanged-signature'},body}));
    assert.equal(response.status, 200);
    assert.deepEqual(globalThis.__paystackRouting.at(-1), {handler:'sureimports', body, signature:'unchanged-signature'});
  }
});
test('only partner-prefixed references enter partner collection or withdrawal handlers', async () => {
  for (const [reference, handler] of [['PCO_123','partner'], ['pww_123','wallet']]) {
    await POST(new Request('https://sureimports.test/api/webhooks/paystack',{method:'POST',body:JSON.stringify({data:{reference}})}));
    assert.equal(globalThis.__paystackRouting.at(-1).handler,handler);
  }
});
