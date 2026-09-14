import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { signBankTransferQuote, readBankTransferQuote } from '../lib/procurement/bankQuote.ts';

test('bank quotes retain the agreed GBP amount and rate', () => {
  process.env.JWT_SECRET = 'test-only-bank-quote-secret-not-a-production-credential';
  const quote = { pidOrder: 'order-test', pidUser: 'user-test', bankId: 'bank-test', usdAmount: 100, amount: 75, currency: 'GBP', gbpPerUsd: 0.75 };
  const token = signBankTransferQuote(quote);
  const decoded = readBankTransferQuote(token);
  for (const [key, value] of Object.entries(quote)) assert.equal(decoded[key], value);
  const parts = token.split('.');
  parts[1] = Buffer.from(JSON.stringify({ ...decoded, amount: 1 })).toString('base64url');
  assert.throws(() => readBankTransferQuote(parts.join('.')));
  const expired = jwt.sign(quote, process.env.JWT_SECRET, { algorithm: 'HS256', audience: 'procurement-bank-transfer', expiresIn: -1 });
  assert.throws(() => readBankTransferQuote(expired), /expired/);
  const wrongPurpose = jwt.sign(quote, process.env.JWT_SECRET, { algorithm: 'HS256', audience: 'another-purpose' });
  assert.throws(() => readBankTransferQuote(wrongPurpose), /audience/);
});
