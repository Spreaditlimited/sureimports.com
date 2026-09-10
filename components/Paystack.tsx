'use client';
import React, { useRef } from 'react';
import PaystackPop from '@paystack/inline-js';
import '@/app/styles/App.css';
import { useRouter } from 'next/navigation';
import xMail from '@/lib/email/xMail';

interface Props {
  titlex: string;
  emailx: string;
  amountx: number;
}

const Paystack: React.FC<Props> = ({ emailx, amountx, titlex }) => {
  const router = useRouter();
  const amountz = amountx;
  const reference = useRef<string | null>(null);

  // you can call this function anything
  const handlePaystackSuccessAction = async (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.

    ////////////////////// SEND PAYMENT RECEIPT EMAIL BLOCK STARTS //////////////////////
    //import { xMail } from '@/lib/email/xMail';
    const xEmail = emailx;
    const xTitle = `Printin Receipt`;
    const xBodyTitle = `Printin Receipt`;
    const xBody1 = `Thank you for placing your order with <b>Printin Reality,</b> your order is currently being processed by our team.</i>`;
    const line1 = `<h3>Order Ref: <b>${reference.current}</b></h3><hr />`;
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

  const openCheckout = () => {
    const paymentReference = `PRINTIN-${Date.now()}`;
    reference.current = paymentReference;
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: 'pk_live_180559190815703bd1abb28053d3d80fb135c91d',
      reference: paymentReference,
      email: emailx,
      amount: amountz * 100,
      onSuccess: handlePaystackSuccessAction,
      onCancel: handlePaystackCloseAction,
    });
  };

  return (
    <button
      type="button"
      className="font mt-5 flex h-12 w-full items-center justify-center rounded bg-blue-400 px-4 py-2 text-center text-xl text-white hover:bg-blue-700"
      onClick={openCheckout}
    >
      {titlex}
    </button>
  );
};

export default Paystack;
