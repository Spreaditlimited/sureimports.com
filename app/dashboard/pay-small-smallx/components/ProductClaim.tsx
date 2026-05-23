'use client';

import { useEffect, useState } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Monitor,
  HandCoins,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiMoney } from 'react-icons/bi';
import Paystack from '@/components/uix/Paystack';
import { useAuth } from '@/app/context/AuthContext';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Loading from '../../loading';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { pid } from 'process';
import { random } from 'lodash';

export default function ProductClaim({ product, status }: any) {
  const router = useRouter();

  const { user } = useAuth();
  const navigateWithAlert = useNavigationWithAlert();

  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [customer, setCustomer] = useState<any | null>(null);
  const [transactions, setTransaction] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [statusx, setStatus] = useState<string | null>(null);
  const [statusz, setStatusz] = useState<string | null>('');

  const [message, setMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<any>('');

  const [pidPaySmallSmall, setPidPaySmallSmall] = useState<string>('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/paystack/get-customer/${email}`);

        // if (!response.ok) {
        //   throw new Error('Failed to fetch customer data');
        // }

        const data: any = await response.json();

        //alert(data.statusx+' '+data.message);
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

  //////////// WALLET ACTIVATION //////////
  function walletActivation() {
    toast.info('Activating Wallet, please wait . . .');

    const activateWallet = async () => {
      try {
        const response = await fetch(
          '/api/paystack/wallet-customer-activation?pidUser=' + user?.pidUser,
        );

        // if (!response.ok) {
        //   throw new Error('Failed to fetch customer data');
        // }

        const data: any = await response.json();

        const customerID = data.customerID;

        if (data.statusx == 'SUCCESS') {
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
              //throw new Error(data.message || 'Failed to create dedicated account');
              toast.warning(
                'Account Activation Failed, please try again or contact support. Error-Msg: ' +
                  data.message,
              );
            } else {
              navigateWithAlert(
                '/dashboard/wallet?status=SUCCESS',
                'success',
                'Wallet was successfully Activated!',
              );
              router.push('/dashboard/pay-small-small?status=SAVED');
              //refreshComponent();
              window.location.reload();
            }
          } catch (err) {
            // setError(
            //   err instanceof Error ? err.message : 'An unknown error occurred',
            // );
            toast.warning(
              'Account Activation Failed, please try again or contact support. Error: ' +
                err,
            );
          } finally {
            setLoading(false);
          }
        }
      } catch (statusx) {
        //setError(error instanceof Error ? error.message : 'Unknown error');
        //setStatus(statusx as string);
      } finally {
        setLoading(false);
      }
    };

    activateWallet();
  }

  //DELETE PAY SMALL SMALL
  const startPaySmallSmall = async (
    pidUser: any,
    pidPaySmallSmall: any,
    pidProduct: any,
    amount: any,
  ) => {
    // Check if the users account is ready
    if (statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') {
      toast.warning(
        'You do not have a wallet account. Please activate your wallet to start paying small small.',
      );
      return;
    }

    // Check if the user has sufficient funds
    if (transactions.totalAmount < 5000) {
      toast.warning(
        'You do not have sufficient funds to activate pay small small. Fund your wallet with a minimum of N5,000 to Activate this product.',
      );
      return;
    }

    toast.info('Processing . . .');
    // Perform the action based on the button clicked

    try {
      const response = await fetch(
        '/api/pay-small-small/start?' +
          'pidUser=' +
          user?.pidUser +
          '&pidPaySmallSmall=' +
          pidPaySmallSmall +
          '&pidProduct=' +
          pidProduct,
      );

      const data: any = await response.json();

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/pay-small-small?status=STARTED');
        //refreshComponent();
        //refreshComponent();
        //window.location.reload();
      }
      if (data.statusx == 'FAILED') {
        toast.warning(data.message);
      }
    } catch (statusx) {
      toast.warning('Action failed! Error: ' + statusx);
      //setError(error instanceof Error ? error.message : 'Unknown error');
      //setStatus(statusx as string);
    } finally {
      setLoading(false);
    }
    // You can perform other actions here like opening a modal
  };

  //CANCEL PAY SMALL SMALL
  const cancelPaySmallSmall = async (
    pidUser: any,
    pidPaySmallSmall: any,
    pidProduct: any,
    amount: any,
  ) => {
    toast.info('Cancelling Pay Small Small . . .');
    // Perform the action based on the button clicked

    try {
      const response = await fetch(
        '/api/pay-small-small/cancel?' +
          'pidUser=' +
          user?.pidUser +
          '&pidPaySmallSmall=' +
          pidPaySmallSmall +
          '&pidProduct=' +
          pidProduct,
      );

      const data: any = await response.json();

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        router.push('/dashboard/pay-small-small?status=CANCELLED');
        //refreshComponent();
        //window.location.reload();
      }
      if (data.statusx == 'FAILED') {
        toast.warning(data.message);
      }
    } catch (statusx) {
      toast.warning('Action failed! Error: ' + statusx);
      //setError(error instanceof Error ? error.message : 'Unknown error');
      //setStatus(statusx as string);
    } finally {
      setLoading(false);
    }
    // You can perform other actions here like opening a modal
  };

  // CLAIM PAY SMALL SMALL
  const claimPaySmallSmall = (
    pidUser: any,
    pidPaySmallSmall: any,
    pidProduct: any,
    amount: any,
  ) => {
    if (parseFloat(transactions.totalAmount) < parseFloat(amount)) {
      toast.warning(
        (('You do not have suffient funds to claim this product. Fund your wallet with a minimum of ₦' +
          parseFloat(amount as any)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) as string) +
          ' to Claim this product.',
      );
      return;
    }

    toast.info('Processing Claim . . .');
    // Perform the action based on the button clicked
  };

  //////////// HANDLE FORM SUBMISSION //////////
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //toast.info('Processing . . .');return;
    //const formData = new FormData(e.currentTarget);
    //formData.append('newStatus', actionType);

    const buttonData = JSON.parse(actionType);

    // Handle Claim action
    if (buttonData.action === 'claim') {
      claimPaySmallSmall(
        pidUser,
        buttonData.pidPaySmallSmall,
        buttonData.pidProduct,
        buttonData.amount,
      );
    }

    // Handle Start action
    if (buttonData.action === 'start') {
      startPaySmallSmall(
        pidUser,
        buttonData.pidPaySmallSmall,
        buttonData.pidProduct,
        buttonData.amount,
      );
    }

    // Handle Cancel action
    if (buttonData.action === 'cancel') {
      toast.custom((t) => (
        <>
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mt-1 text-xl font-bold">
                    Cancel Pay Small Small
                  </h3>
                  <br />
                  {status === 'STARTED' && (
                    <>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Are you sure you want to cancel this Pay Small Small
                        Product? Note that a 2.5% inconvenience fee will be
                        deducted for this action from the product price as
                        stated here.
                      </p>
                      <br />
                    </>
                  )}
                  <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => toast.dismiss(t)}
                      className={
                        'mr-5 rounded-lg bg-gray-500 px-4 py-1 text-white'
                      }
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() =>
                        cancelPaySmallSmall(
                          pidUser,
                          buttonData.pidPaySmallSmall,
                          buttonData.pidProduct,
                          buttonData.amount,
                        )
                      }
                      className={
                        'mr-5 rounded-lg bg-red-700 px-4 py-1 text-white'
                      }
                    >
                      Confirm
                    </button>

                    {/* <button
                            type="submit"
                            name="action"
                            value="in-transit"
                            onClick={() => setActionType('in-transit')}
                            className="btn btn-secondary mt-4 w-full rounded-md bg-indigo-600 py-3 text-sm text-white shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          >
                            Create Refund & Move Order for Shipping
                          </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ));
    }

    // Perform your form submission logic here
  }

  return (
    <div
      key={refreshKey}
      className="min-h-screen w-full bg-gray-100 p-4 dark:bg-slate-900 md:p-8"
    >
      <div className="max-w-4xlx mx-auto">
        {/* Main Content Container */}
        <div className="overflow-hidden rounded-lg bg-gray-100 text-gray-800 dark:bg-slate-900">
          {/* Pay Small Small Header */}
          <div className="border-b border-gray-500 p-4">
            <h1 className="flex text-2xl font-bold text-gray-800 dark:text-white">
              <HandCoins />
              &nbsp; Pay Small Small
            </h1>
          </div>

          {/* PAY SMALL SMALL STATE BUTTONS */}
          {/* <div className="border-b border-gray-500 bg-slate-500 p-4"> */}
          <div className="scrollbar-hide overflow-x-auto">
            <div className="flex min-w-max bg-slate-200 p-2 dark:bg-gray-700">
              <button
                onClick={() =>
                  router.push('/dashboard/pay-small-small?status=SAVED')
                }
                className={
                  'mr-5 rounded-lg px-4 py-1 text-white ' +
                  (status == 'SAVED' ? 'bg-indigo-800' : 'bg-gray-700')
                }
              >
                Saved
              </button>

              <button
                onClick={() =>
                  router.push('/dashboard/pay-small-small?status=STARTED')
                }
                className={
                  'mr-5 rounded-lg px-4 py-1 text-white ' +
                  (status == 'STARTED' ? 'bg-indigo-800' : 'bg-gray-700')
                }
              >
                Started
              </button>

              <button
                type="submit"
                name="action"
                value="in-transit"
                //onClick={() => setActionType('in-transit')}
                onClick={() =>
                  router.push('/dashboard/pay-small-small?status=COMPLETED')
                }
                className={
                  'mr-5 rounded-lg px-4 py-1 text-white ' +
                  (status == 'COMPLETED' ? 'bg-indigo-800' : 'bg-gray-700')
                }
              >
                Completed
              </button>

              <button
                onClick={() =>
                  router.push('/dashboard/pay-small-small?status=CANCELLED')
                }
                className={
                  'mr-5 rounded-lg px-4 py-1 text-white ' +
                  (status == 'CANCELLED' ? 'bg-indigo-800' : 'bg-gray-700')
                }
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Account Details */}
          {statusx == 'WALLET_READY' && (
            <div className="border-b border-gray-500 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mt-1 text-xl font-bold text-gray-500">
                    Virtual Account Details
                  </h3>{' '}
                  <br />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank: &nbsp; <b>{customer.bankName}</b>
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Name:&nbsp; <b>{customer.bankAccountName}</b>
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Account Number:&nbsp; <b>{customer.bankAccountNumber}</b>
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Currency:&nbsp; <b>{customer.currency}</b>
                  </p>
                </div>
              </div>
            </div>
          )}
          {(statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') && (
            <div className="flex justify-center">
              <button
                onClick={() => walletActivation()}
                className="m-5 flex w-full max-w-xs justify-center rounded-lg bg-emerald-600 px-3 py-3 text-lg font-medium text-white transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-400"
              >
                Activate Wallet
              </button>
            </div>
          )}

          {/* Wallet Balance */}
          <div className="bg-gray-200 p-4 dark:bg-gray-500">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-900">
                Wallet Balance:
              </h3>

              {statusx == 'WALLET_READY' && (
                <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-900">
                  ₦
                  {
                    parseFloat(transactions.totalAmount as any)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                  }
                </span>
              )}

              {(statusx == 'NO_ACCOUNT' || statusx == 'NO_CUSTOMER') && (
                <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-900">
                  ₦0.00
                </span>
              )}
            </div>
          </div>

          {/** LOOP RECORDS STARTS */}
          {product.map((datax: any) => {
            return (
              <>
                <form key={datax.id} onSubmit={handleSubmit}>
                  {/* Product Section */}
                  <div
                    key={datax.id}
                    className="mt-2 bg-gray-200 p-4 dark:bg-gray-400"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="mb-4 w-full md:mb-0 md:w-1/5">
                        <div className="aspect-square w-full max-w-[120px] rounded-lg bg-blue-500">
                          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <img
                              src={
                                (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL +
                                  '/' +
                                  `${datax.store.productImage}`) as string
                              }
                              alt="Product Image"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="w-full md:px-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-900">
                          {datax.store.productName} | ₦
                          {
                            parseFloat(datax.amount as any)
                              .toFixed(2)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                          }
                        </h3>
                        <small> {datax.updatedAt.toString()} </small>

                        <p className="mt-2 text-gray-700 dark:text-gray-800">
                          {datax.store.productDescription}
                        </p>

                        {/* <input
                          type="hidden"
                          name="pidProduct"
                          //onChange={(e) => setCategoryName(e.target.value)}
                          value={datax.pidProduct}
                        /> */}

                        {status === 'SAVED' && (
                          <div className="mt-4 flex items-center">
                            <Checkbox
                              key={datax.id}
                              id={'saved-checkbox-' + datax.id}
                              name={'saved-checkbox-' + datax.id}
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //checked={isChecked}
                              //   onCheckedChange={(checked) =>
                              //     setIsChecked(checked === true)
                              //   }
                              required
                              className="border-gray-500 bg-indigo-800 text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={'saved-checkbox-' + datax.id}
                              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-800"
                            >
                              Check this box to Activate / Cancel your product
                            </label>
                          </div>
                        )}

                        {status === 'STARTED' && (
                          <div className="mt-4 flex items-center">
                            <Checkbox
                              key={datax.id}
                              id={'saved-checkbox-' + datax.id}
                              name={'saved-checkbox-' + datax.id}
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //checked={isChecked}
                              //   onCheckedChange={(checked) =>
                              //     setIsChecked(checked === true)
                              //   }
                              required
                              className="border-gray-500 bg-indigo-800 text-white data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                            />
                            <label
                              htmlFor={'saved-checkbox-' + datax.id}
                              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-800"
                            >
                              Check this box to Claim / Cancel your product
                            </label>
                          </div>
                        )}
                      </div>

                      {/** START PAYING SMALL SMALL */}
                      <div className="mt-4 w-full justify-start md:mt-0 md:w-1/5 md:justify-end">
                        {/* START PAYING SMALL SMALL */}
                        {status === 'SAVED' && (
                          <>
                            <Button
                              key={datax.id}
                              id={'start-button-' + datax.id}
                              name={'start-button-' + datax.id}
                              onClick={() =>
                                setActionType(
                                  JSON.stringify({
                                    action: 'start',
                                    pidPaySmallSmall: datax.pidPaySmallSmall,
                                    pidProduct: datax.pidProduct,
                                  }),
                                )
                              }
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //onClick={() => handleButtonClick('claim', 'pidPaySmallSmall', 'pidProduct')}
                              className="rounded-md bg-indigo-800 px-4 py-2 text-white hover:bg-indigo-700"
                              // disabled={!isChecked}
                            >
                              Activate Pay Small Small
                            </Button>

                            {/* -------------------------- */}

                            <Button
                              key={datax.id}
                              id={'cancel-button-' + datax.id}
                              name={'cancel-button-' + datax.id}
                              onClick={() =>
                                setActionType(
                                  JSON.stringify({
                                    action: 'cancel',
                                    pidPaySmallSmall: datax.pidPaySmallSmall,
                                    pidProduct: datax.pidProduct,
                                    amount: datax.amount,
                                  }),
                                )
                              }
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //onClick={() => handleButtonClick('claim', 'pidPaySmallSmall', 'pidProduct')}
                              className="m-5 bg-gray-400"
                              // disabled={!isChecked}
                            >
                              Cancel PSS
                            </Button>
                          </>
                        )}

                        {/* START PAYING SMALL SMALL */}
                        {status === 'STARTED' && (
                          <>
                            <Button
                              key={datax.id}
                              id={'claim-button-' + datax.id}
                              name={'claim-button-' + datax.id}
                              onClick={() =>
                                setActionType(
                                  JSON.stringify({
                                    action: 'claim',
                                    pidPaySmallSmall: datax.pidPaySmallSmall,
                                    pidProduct: datax.pidProduct,
                                    amount: datax.amount,
                                  }),
                                )
                              }
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //onClick={() => handleButtonClick('claim', 'pidPaySmallSmall', 'pidProduct')}
                              className="rounded-xl bg-indigo-800 px-4 py-2 text-white hover:bg-indigo-700"
                              // disabled={!isChecked}
                            >
                              Claim Product
                            </Button>

                            {/* -------------------------- */}

                            <Button
                              key={datax.id}
                              id={'cancel-button-' + datax.id}
                              name={'cancel-button-' + datax.id}
                              onClick={() =>
                                setActionType(
                                  JSON.stringify({
                                    action: 'cancel',
                                    pidPaySmallSmall: datax.pidPaySmallSmall,
                                    pidProduct: datax.pidProduct,
                                  }),
                                )
                              }
                              //onClick={() => setPidPaySmallSmall(datax.pidPaySmallSmall)}
                              //onClick={() => handleButtonClick('claim', 'pidPaySmallSmall', 'pidProduct')}
                              className="m-5 bg-gray-400"
                              // disabled={!isChecked}
                            >
                              Cancel PSS
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </>
            );
          })}
          {/** LOOP RECORDS ENDS */}

          {product.length == 0 && (
            <div className="mt-2 bg-gray-200 p-4 dark:bg-gray-400">
              {(status === 'SAVED' || status === 'STARTED') && (
                <div className="flex flex-col md:flex-row">
                  No Product Found &nbsp;{' '}
                  <a href="/dashboard/store?id=laptop">
                    {' '}
                    <b className="text-orange-600">Visit Store</b>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
