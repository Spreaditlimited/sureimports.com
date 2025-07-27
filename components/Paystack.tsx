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
  emailx: string;
  amountx: number;
}

const Paystack: React.FC<Props> = ({ emailx, amountx, titlex }) => {
  const router = useRouter();
  let amountz = amountx;
  let ref = new Date().getTime().toString();

  const config = {
    reference: ref,
    email: emailx,
    amount: amountz * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_live_180559190815703bd1abb28053d3d80fb135c91d',
    //publicKey: 'pk_test_e287a375d2c699083a87252e91f876d708f6897a',
  };

  // you can call this function anything
  const handlePaystackSuccessAction = async (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.

    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = emailx;
    const xTitle = `Printin Receipt`;
    const xBodyTitle = `Printin Receipt`;
    const xBody1 = `Thank you for placing your order with <b>Printin Reality,</b> your order is currently being processed by our team.</i>`;
    const line1 = `<h3>Order Ref: <b>${ref}</b></h3><hr />`;
    const line2 = `<h3>Amount Paid: <b>₦${amountz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</b></h3><hr />`;
    const xBody2 = line1 + line2;
    const xButtonTitle = `Go to Dashboard`;
    const xButtonLink = `https://printin.ng/dashboard/orders`;
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

    router.push('/success-payment');
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    router.push('/cancelled-payment');
    console.log('closed');
  };

  const componentProps = {
    ...config,
    text: titlex,
    onSuccess: (reference: any) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <PaystackButton
      className="font mt-5 flex h-12 w-full items-center justify-center rounded bg-blue-400 px-4 py-2 text-center text-xl text-white hover:bg-blue-700"
      {...componentProps}
    />
  );
};

export default Paystack;
