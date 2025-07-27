import BankPaymentForm from '@/components/dashboard/pay-supplier/bank-payment-form';
import React from 'react';

function BankPayment() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800">
      <div className="pl-[25px] pt-[25px] text-[28px] font-bold text-slate-800 dark:text-white">
        Bank Payment{' '}
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-[#161629] dark:text-white">
        <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Bank details 1:
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                Spreadit Limited
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Bank Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                GT Bank
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Number:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                0449334088
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Bank details 2:
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Spreadit Limited
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Bank Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Zenith Bank
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Number:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                1016797924
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[20px] p-[25px]">
          <div className="flex flex-col text-lg font-bold text-slate-800 dark:text-white">
            Foreign Payments:
            <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
              (For payments outside Nigeria)
            </span>
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Name:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Spreadit Limited
              </span>
            </p>
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Bank Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Guaranty Trust Bank Ltd
              </span>
            </p>
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Account Number:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                0449334095
              </span>
            </p>
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Swift code:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                GTBINGLA
              </span>
            </p>{' '}
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36 text-sm text-slate-600">
                Routing Number:
              </span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                058-152609
              </span>
            </p>
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Bank Address: </span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                GTBank, 1 obediyi close, off St. Gregory, Ikoyi, Lagos
              </span>
            </p>
          </div>
        </div>

        {/* <div className="flex flex-col gap-[20px] p-[25px] pb-0">
          <div className="flex flex-col text-lg font-bold text-slate-800 dark:text-white">
            Pay to our USA Bank Account
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Name:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white max-md:pl-5">
                Spreadit Sourcing LLC
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="max-md:pr-3 md:w-36">Account Number:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                202360195650
              </span>
            </p>

            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="md:w-36">Beneficiary Address: </span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                1942 Broadway Ste 314C, Boulder, CO 80302
              </span>
            </p>
          </div>
        </div> */}

        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="flex flex-col text-sm font-normal text-slate-600 dark:text-white">
            (Receiving Bank Details)
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[56px]">
              <span className="max-md:pr-3">ABA Routing Number:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                091311229
              </span>
            </p>
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Bank Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Choice Financial Group
              </span>
            </p>

            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Bank Address: </span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                4501 23rd Avenue S Fargo, ND 58104
              </span>
            </p>
          </div>
        </div> */}

        <div className="item-center flex gap-[74px] border-b p-[20px] text-slate-800 dark:border-slate-300 dark:text-white max-sm:flex-col max-sm:gap-[20px]">
          <p className="w-36">Amount to be paid</p>
          <div className="text-2xl font-bold text-indigo-800">
            ₦199.00 Naira{' '}
          </div>
        </div>
        <BankPaymentForm />
      </div>
    </div>
  );
}

export default BankPayment;
