import BankPaymentForm from '@/app/dashboard/bank-payment/components/bank-payment-form';
import React from 'react';
import Image from 'next/image';
import { Link2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TbBrandRevolut } from 'react-icons/tb';

function BankPayment() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800">
      <div className="pl-[25px] pt-[25px] text-[28px] font-bold text-slate-800 dark:text-white">
        Payment Channels{' '}
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-[#161629] dark:text-white">
        <div className="mx-auto mb-6 w-full max-w-4xl">
          <div
            className="rounded-b-lg border-t-4 border-blue-500 bg-blue-100 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex items-center">
              <div className="py-1">
                <svg
                  className="mr-4 h-6 w-6 fill-current text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-700 md:text-base">
                  After payment via any of our channels below, please, come back
                  to this screen to submit the details of this payment so we can
                  start processing your order.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BANK 0 */}
        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Revolut Pay (UK Customers Only):
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <a
                href="https://checkout.revolut.com/pay/a864e15f-7b42-4f4e-b198-ecf37c092636"
                className="flex rounded-xl bg-indigo-800 px-[25px] py-[15px] font-medium text-white"
                target="_blank"
              >
                <TbBrandRevolut className="text-xl text-gray-400" />
                &nbsp; Revolut Pay
              </a>
            </p>
          </div>
        </div> */}

        {/* BANK 1 */}
        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Revolut USD Bank Account:
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                SPREADIT SOURCING LTD
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient address:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                85 Great Portland Street, First Floor, W1W 7LT, London, United
                Kingdom.
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">IBAN:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                GB70 REVO 0099 6931 8548 61
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Intermediary BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                CHASGB2L
              </span>
            </p>
          </div>
        </div> */}

        {/* BANK 2 */}
        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Revolut GBP Bank Account:
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                SPREADIT SOURCING LTD
              </span>
            </p>
            <br />

            <p className="flex sm:gap-[74px]">
              <i>Transfer from a UK bank?</i>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient address:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                85 Great Portland Street, First Floor, W1W 7LT, London, United
                Kingdom.
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account number:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                28709089
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Sort code:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                23-01-20
              </span>
            </p>
            <br />

            <p className="flex sm:gap-[74px]">
              <i>Transfer from outside the UK?</i>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient address:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                85 Great Portland Street, First Floor, W1W 7LT, London, United
                Kingdom.
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">IBAN:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                GB70 REVO 0099 6931 8548 61
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                REVOGB21
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Intermediary BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                CHASGB2L
              </span>
            </p>
          </div>
        </div> */}

        {/* BANK 3 */}
        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Revolut Euro Bank Account:
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                SPREADIT SOURCING LTD
              </span>
            </p>
            <br />

            <p className="flex sm:gap-[74px]">
              <i>Transfer from a bank in the European Economic Area?</i>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient address:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                85 Great Portland Street, First Floor, W1W 7LT, London, United
                Kingdom.
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">IBAN:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                GB70 REVO 0099 6931 8548 61
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                REVOGB21
              </span>
            </p>
            <br />

            <p className="flex sm:gap-[74px]">
              <i>Transfer from outside the European Economic Area?</i>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Recipient address:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                85 Great Portland Street, First Floor, W1W 7LT, London, United
                Kingdom.
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">IBAN:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                GB70 REVO 0099 6931 8548 61
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                REVOGB21
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Intermediary BIC:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                CHASDEFX
              </span>
            </p>
          </div>
        </div> */}

        {/* BANK 4 */}
        <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Guarantee Trust Bank, Nigeria:
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

        {/* BANK 5 */}
        <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Zenith Bank, Nigeria :
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

        {/* BANK 3 */}
        {/* <div className="flex flex-col gap-[20px] border-b p-[25px] dark:border-slate-300">
          <div className="text-lg font-bold text-slate-800 dark:text-white">
            Access Bank, Nigeria :
          </div>
          <div className="flex flex-col gap-[12px]">
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Sure Importers Limited
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Bank Name:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                Access Bank
              </span>
            </p>
            <p className="flex sm:gap-[74px]">
              <span className="w-36">Account Number:</span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                {' '}
                0766818624
              </span>
            </p>
          </div>
        </div> */}

        {/* BANK 4 */}
        {/* <div className="flex flex-col gap-[20px] p-[25px]">
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
              <span className="w-36">Routing Number:</span>{' '}
              <span className="text-base font-normal text-slate-600 dark:text-white">
                058-152609
              </span>
            </p>{' '}
            <p className="flex max-sm:flex-col sm:gap-[74px]">
              <span className="w-36">Bank Address: </span>
              <span className="text-base font-normal text-slate-600 dark:text-white">
                GTBank, 1 obediyi close, off St. Gregory, Ikoyi, Lagos
              </span>
            </p>
          </div>
        </div> */}

        {/* <div className="item-center flex gap-[74px] border-b p-[20px] text-slate-800 dark:border-slate-300 dark:text-white max-sm:flex-col max-sm:gap-[20px]">
          <p className="w-36">Amount to be paid</p>
          <div className="text-2xl font-bold text-indigo-800">₦0.00 Naira </div>
        </div> */}

        <BankPaymentForm />
      </div>
    </div>
  );
}

export default BankPayment;
