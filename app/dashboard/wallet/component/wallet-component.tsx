'use client';

import type React from 'react';

import { Suspense, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2Icon,
  CreditCard,
  HandCoins,
  Home,
  Menu,
  Moon,
  PieChart,
  Plus,
  Settings,
  ShoppingBag,
  Sun,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { ThemeProvider } from './theme-provider';
import { Popup } from './popup';
import Paystack from '@/components/uix/Paystack';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useAuth } from '@/app/context/AuthContext';
import { useModal } from '@/app/context/ModalContext';
import Loading from '../../loading';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import WalletTransactionTable from './WalletTransactionTable';
//import GetDedicatedAccount from './GetDedicatedAccount';
//import GetPaystackCustomer from './GetPaystackCustomer';

export default function WalletDashboard() {
  const navigateWithAlert = useNavigationWithAlert();

  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const router = useRouter();

  //modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactions, setTransaction] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/paystack/get-customer/${email}`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch customer data');
        // }

        const data: any = await response.json();

        //alert(data.statusx + ' ' + data.message);
        setStatus(data.statusx);
        setMessage(data.message);
        setCustomer(data.customerDetails);
        setTransaction(data.transactionDetails);
      } catch (statusx) {
        //setError(error instanceof Error ? error.message : 'Unknown error');
        //setStatus(statusx as string);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [email]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  ////////// NO CUSTOMER PROFILE //////////
  if (statusx == 'NO_CUSTOMER')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-700/20">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
              Wallet Activation
            </h1>

            <button
              onClick={() => walletActivation()}
              className="w-full max-w-xs rounded-lg bg-emerald-600 px-6 py-6 text-lg font-medium text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400"
            >
              Initialize Wallet Profile & Activate Wallet Account
            </button>

            <p className="text-center text-slate-600 dark:text-slate-300">
              {message}
            </p>

            <small className="text-orange-400">
              Please ensure you have updated your profile with your{' '}
              <b>Valid Phone Number</b> before you can be allowed to create a
              wallet
            </small>
            <small>
              <a href="/dashboard/profile-update">
                Click <b>here</b> Update Profile & Phone Number
              </a>
            </small>
          </div>
        </div>
      </div>
    );

  ////////// NO ACCOUNT //////////
  if (statusx == 'NO_ACCOUNT')
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-700/20">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
              Wallet Activation
            </h1>

            <button
              onClick={() => walletActivation()}
              className="w-full max-w-xs rounded-lg bg-emerald-600 px-6 py-6 text-lg font-medium text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400"
            >
              Activate Wallet Account
            </button>

            <p className="text-center text-slate-600 dark:text-slate-300">
              {message}
            </p>

            <small className="text-orange-400">
              Please ensure you have updated your profile with your{' '}
              <b>Valid Phone Number</b> before you can be allowed to create a
              wallet
            </small>
            <small>
              <a href="/dashboard/profile-update">
                Click <b>here</b> Update Profile & Phone Number
              </a>
            </small>
          </div>
        </div>
      </div>
    );

  //////////// WALLET ACTIVATION //////////
  function walletActivation() {
    toast.info('Initializing Profile and Account');
    setLoading(true);

    const activateWallet = async () => {
      try {
        const response = await fetch(
          '/api/paystack/wallet-customer-activation?pidUser=' + user?.pidUser,
        );
        const data: any = await response.json();
        const customerID = data?.customerID;

        if (data?.statusx == 'SUCCESS' && customerID) {
          toast.success(data.message);

          try {
            const response = await fetch(
              '/api/paystack/wallet-bank-activation',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  customer: customerID,
                  preferred_bank: 'wema-bank',
                }),
              },
            );

            const data: any = await response.json();

            if (!data.status) {
              toast.warning(
                'Account Activation Failed, please try again or contact support. Error-Msg: ' +
                  data.message,
              );
            } else {
              navigateWithAlert(
                '/dashboard/wallet?id=success',
                'success',
                'Wallet was successfully Activated!',
              );
              router.push('/dashboard/redirect?page=wallet');
            }
          } catch (err) {
            toast.warning(
              'Account Activation Failed, please try again or contact support. Error: ' +
                err,
            );
          }
        } else {
          toast.warning(
            data?.message ||
              'Wallet activation failed. Please confirm your profile details and try again.',
          );
        }
      } catch (error) {
        toast.error(
          `Wallet activation request failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      } finally {
        setLoading(false);
      }
    };

    activateWallet();
  }

  ////////// WALLET READY //////////
  if (statusx == 'WALLET_READY') {
    return (
      <>
        <div className="text-center">
          {/* <GetPaystackCustomer email={email as string} /> */}
          <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div>
              <div>
                <h4 className="mt-1 text-2xl font-bold">Bank Payment</h4> <br />
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                  Bank: &nbsp; <b>{customer.bankName}</b>
                </p>
                <p className="text-xl font-medium text-gray-500 dark:text-gray-400">
                  Account Number:&nbsp; <b>{customer.bankAccountNumber}</b>
                </p>
                <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                  Account Name:&nbsp; <b>{customer.bankAccountName}</b>
                </p>
                <br />
                <p className="text-blue-500">
                  Pay into your virtual account above
                </p>
              </div>
              {/* <button onClose={() => setIsOpen(false)} /> */}
              {/* <button
                className="m-3 rounded-md bg-slate-900 p-3"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button> */}
            </div>
          </Popup>

          <Popup isOpen={isOpen2} onClose={() => setIsOpen2(false)}>
            <div>
              <h2 className="mb-4 text-center text-2xl font-bold">
                Card Payment
              </h2>
              {/* <button onClose={() => setIsOpen(false)} /> */}
              {/* <button className="bg-slate-600" onClick={() => setIsOpen(false)}>Close</button> */}
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Enter Amount to Credit"
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
              />
              <Paystack
                titlex=" Pay | Via Paystack "
                quantityx={quantity as number}
                emailx={user?.userEmail as string}
                amountx={amount as number}
                currency={'NGN'}
                serviceID={'WALLET'}
                disabled={false}
              />
            </div>

            <p className="pt-10 text-blue-500">
              Pay via Paystack to credit your wallet
            </p>
          </Popup>
        </div>

        <div className="panel text-dark flex items-center overflow-x-auto whitespace-nowrap p-3">
          <span className="pl-2 text-xl md:pl-4">
            <b>Wallet</b>
          </span>
        </div>

        <div className="flex min-h-screen flex-col bg-slate-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
          <div className="flex flex-1">
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <div className="max-w-6xlx mx-auto space-y-6">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mt-1 text-2xl font-bold">
                            Virtual Account Details
                          </h3>{' '}
                          <br />
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Bank: &nbsp; <b>{customer.bankName}</b>
                          </p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Account Name:&nbsp;{' '}
                            <b>{customer.bankAccountName}</b>
                          </p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Account Number:&nbsp;{' '}
                            <b>{customer.bankAccountNumber}</b>
                          </p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Currency:&nbsp; <b>{customer.currency}</b>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <BalanceCard
                    title="Total Balance"
                    amount={
                      ('₦' +
                        (transactions.totalAmount as number)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string
                    }
                    change="Balance"
                    icon={<Wallet className="h-5 w-5" />}
                  />
                  <BalanceCard
                    title="Credit"
                    amount={
                      ('₦' +
                        (transactions.totalAmount as number)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string
                    }
                    change="Credit Total"
                    icon={<ArrowDownRight className="h-5 w-5" />}
                    positive
                  />
                  <BalanceCard
                    title="Debit"
                    amount={'₦' + transactions.totalDebit}
                    change="Debit Total"
                    icon={<ArrowUpRight className="h-5 w-5" />}
                    negative
                  />
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      {/* <ActionButton icon={<Plus />} label="Credit Wallet : Bank Payment" /> */}
                      <button
                        onClick={() => setIsOpen(true)}
                        className="flex h-auto flex-col items-center gap-2 rounded-lg border border-gray-200 px-2 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                          {<Building2Icon />}
                        </div>
                        <span className="text-xs">
                          Credit Wallet : Bank Payment
                        </span>
                      </button>

                      {/* <button
                        onClick={() => setIsOpen2(true)}
                        className="flex h-auto flex-col items-center gap-2 rounded-lg border border-gray-200 px-2 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                          {<CreditCard />}
                        </div>
                        <span className="text-xs">
                          Credit Wallet : Card Payment
                        </span>
                      </button> */}

                      <button
                        onClick={() =>
                          router.push('/dashboard/pay-small-small?status=SAVED')
                        }
                        className="flex h-auto flex-col items-center gap-2 rounded-lg border border-gray-200 px-2 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                          {<HandCoins />}
                        </div>
                        <span className="text-xs">Pay Small Small</span>
                      </button>

                      {/* <ActionButton icon={<User />} label="Pay Small Small" /> */}
                      <button
                        onClick={() =>
                          router.push('/dashboard/store?id=laptop')
                        }
                        className="flex h-auto flex-col items-center gap-2 rounded-lg border border-gray-200 px-2 py-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
                          {<ShoppingBag />}
                        </div>
                        <span className="text-xs">Buy Phones & Laptops</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex flex-row items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Recent Transactions
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Your recent financial activity
                      </p>
                    </div>
                    <button className="rounded-md border border-gray-200 px-3 py-1 text-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                      View All
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="rounded-lg bg-gray-200 p-1 shadow dark:bg-gray-500">
                        <Suspense fallback={<Loading />}>
                          {transactions.transactions.length > 0 && (
                            <WalletTransactionTable
                              transactions={transactions.transactions}
                            />
                          )}
                          {transactions.transactions.length == 0 && (
                            <div className="flex items-center justify-center p-4">
                              <p className="text-sm text-gray-600 dark:text-gray-800">
                                No transactions available
                              </p>
                            </div>
                          )}
                        </Suspense>
                      </div>

                      {/* <Transaction
                      name="Netflix Subscription"
                      date="Today, 12:42 PM"
                      amount="-$15.99"
                      icon={
                        <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 font-medium">
                          N
                        </div>
                      }
                      negative
                    />
                    <Transaction
                      name="Salary Deposit"
                      date="Yesterday, 9:30 AM"
                      amount="+$2,450.00"
                      icon={
                        <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium">
                          SD
                        </div>
                      }
                      positive
                    />
                    <Transaction
                      name="Grocery Store"
                      date="Mar 24, 2:15 PM"
                      amount="-$86.43"
                      icon={
                        <div className="h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-medium">
                          GS
                        </div>
                      }
                      negative
                    />
                    <Transaction
                      name="Freelance Payment"
                      date="Mar 22, 11:05 AM"
                      amount="+$350.00"
                      icon={
                        <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                          FP
                        </div>
                      }
                      positive
                    />
                    <Transaction
                      name="Amazon Purchase"
                      date="Mar 20, 8:45 PM"
                      amount="-$124.99"
                      icon={
                        <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-medium">
                          A
                        </div>
                      }
                      negative
                    /> */}
                    </div>
                  </div>
                  {/* <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-center">
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                    Load More
                  </button>
                </div> */}
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-10 mt-2 w-36 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <button
            className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme('light');
              setMenuOpen(false);
            }}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </button>
          <button
            className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme('dark');
              setMenuOpen(false);
            }}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </button>
          <button
            className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setTheme('system');
              setMenuOpen(false);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>System</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface BalanceCardProps {
  title: string;
  amount: string;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
  negative?: boolean;
}

function BalanceCard({
  title,
  amount,
  change,
  icon,
  positive = false,
  negative = false,
}: BalanceCardProps) {
  const changeColor = positive
    ? 'text-green-600 dark:text-green-400'
    : negative
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="mt-1 text-2xl font-bold">{amount}</h3>
            <p className={`mt-1 text-sm ${changeColor}`}>{change}</p>
          </div>
          <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

// function ActionButton({ icon, label }: ActionButtonProps) {
//   return (
//     <button
//     onClick={() => setIsOpen(true)}
//     className="h-auto flex flex-col items-center py-4 px-2 gap-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//       <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">{icon}</div>
//       <span className="text-xs">{label}</span>
//     </button>
//   )
// }

interface TransactionProps {
  name: string;
  date: string;
  amount: string;
  icon: React.ReactNode;
  positive?: boolean;
  negative?: boolean;
}

function Transaction({
  name,
  date,
  amount,
  icon,
  positive = false,
  negative = false,
}: TransactionProps) {
  const amountColor = positive
    ? 'text-green-600 dark:text-green-400'
    : negative
      ? 'text-red-600 dark:text-red-400'
      : 'text-gray-900 dark:text-white';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p className={`font-medium ${amountColor}`}>{amount}</p>
        {positive && (
          <span className="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:border-green-800/30 dark:bg-green-900/30 dark:text-green-400">
            Income
          </span>
        )}
        {negative && (
          <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:border-red-800/30 dark:bg-red-900/30 dark:text-red-400">
            Expense
          </span>
        )}
      </div>
    </div>
  );
}
