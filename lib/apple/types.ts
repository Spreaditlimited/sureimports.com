import type { NextResponse } from 'next/server';
export type Account = {
  id: string;
  email: string;
  active: boolean;
  password?: string | null;
};
export type Details = {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  acceptedTerms: boolean;
};
export interface Store {
  rows<T>(sql: string, values?: unknown[]): Promise<T[]>;
  execute(sql: string, values?: unknown[]): Promise<number>;
}
export interface Accounts extends Store {
  find(email: string): Promise<Account | null>;
  get(id: string): Promise<Account | null>;
  verify(account: Account, password: string): Promise<boolean>;
  create(email: string, details: Details): Promise<Account>;
}
export interface Adapter extends Accounts {
  current(request: Request): Promise<Owner | null>;
  namespace: string;
  origin: string;
  login: string;
  home: string;
  brand: string;
  terms: string;
  transaction<T>(fn: (tx: Accounts) => Promise<T>): Promise<T>;
  session(
    account: Account,
    request: Request,
    response: NextResponse,
    next: string,
    rememberMe?: boolean,
  ): Promise<string | void>;
}
export type Owner = {
  account: Account;
  sessionHash: string;
  createdAt: number;
};
