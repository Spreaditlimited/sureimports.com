'use client';

import React from 'react';
import logo from '@/public/assets/images/svg/Printin_logo.svg';
import Image from 'next/image';
import { PaystackButton } from 'react-paystack';
import '@/app/styles/App.css';
import { useRouter } from 'next/navigation';
import sendEmail from '@/lib/email/config/sendEmail';
import mailTemplate from '@/lib/email/temp/mailTemplate';
import xMail from '@/lib/email/xMail';

interface Props {
  titlex: string;
  quantityx: number;
  emailx: string;
  amountx: number;
  currency: string;
  serviceID: string;
  disabled: boolean;
}

const Paystack: React.FC<Props> = ({
  emailx,
  quantityx,
  amountx,
  titlex,
  currency,
  serviceID,
  disabled,
}) => {
  const router = useRouter();
  let amountz = amountx;
  let ref = new Date().getTime().toString();

  const config = {
    reference: ref,
    email: emailx,
    amount: amountz * 100 * quantityx, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    currency: currency,
  };

  // you can call this function anything
  const handlePaystackSuccessAction = async (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.

    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = emailx;
    const xTitle = `SureImport Receipt`;
    const xBodyTitle = `SureImport Receipt`;
    const xBody1 = `Thank you for placing your order with <b>SureImport, </b>.</i>`;
    const line1 = `<h3>Request Order Ref: <b>${ref}</b></h3><hr />`;
    const line2 = `<h3>Amount Paid: <b>₦${amountz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h3><hr />`;
    const xBody2 = line1 + line2;
    const xButtonTitle = `Go to Dashboard`;
    const xButtonLink = `https://sureimports.com/dashboard`;
    xMail({
      xEmail,
      xTitle,
      xBodyTitle,
      xBody1,
      xBody2,
      xButtonTitle,
      xButtonLink,
    });
    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////

    router.push('/dashboard/success/payment');
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    router.push('/dashboard/failed/payment');
    console.log('closed');
  };

  const componentProps = {
    ...config,
    text: titlex,
    disabled: disabled,
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <PaystackButton
      className="flex w-full flex-1 items-center justify-center rounded-md bg-blue-600 p-3 font-medium text-white transition-colors hover:bg-blue-700"
      {...componentProps}
    />
  );
};

export default Paystack;
