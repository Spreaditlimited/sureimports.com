import jwt from 'jsonwebtoken';

export type BankTransferQuote = {
  pidOrder: string;
  pidUser: string;
  bankId: string;
  usdAmount: number;
  amount: number;
  currency: string;
  gbpPerUsd: number;
};
function key() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('Bank transfer quote signing is unavailable.');
  return value;
}
export function signBankTransferQuote(quote: BankTransferQuote) {
  return jwt.sign(quote, key(), {
    algorithm: 'HS256',
    expiresIn: '24h',
    audience: 'procurement-bank-transfer',
  });
}
export function readBankTransferQuote(token: string): BankTransferQuote {
  return jwt.verify(token, key(), {
    algorithms: ['HS256'],
    audience: 'procurement-bank-transfer',
  }) as BankTransferQuote;
}
