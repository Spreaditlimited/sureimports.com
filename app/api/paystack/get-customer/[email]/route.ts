import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type PaystackDedicatedAccountResponse = {
  status: boolean;
  message: string;
  data?: any;
};

type RequestBody = {
  customer: number;
  preferred_bank: string;
};

export async function GET(
  request: Request,
  { params }: { params: { email: string } },
) {

  //sum all the amount from debits table where pidUser = pidUser and paymentStatus = 'PAID' 
  // Sum all amounts from debits where pidUser matches and paymentStatus is PAID
  const emailx = params.email; // change this if pidUser is not the email


    const user:any = await prisma.users.findUnique({
      where: {
        userEmail: emailx as string | undefined,
      },
    });

  const debitAggregate = await prisma.debits.aggregate({
    where: {
      email: user?.email,
      paymentStatus: 'DEBITED',
    },
    _sum: {
      amount: true,
    },
  });
  const totalDebit = debitAggregate._sum.amount ?? 0;

  console.log('Total Debit Amount:', totalDebit);


  try {
    const { email } = await params; // Properly destructure params

    //const email = 'sureimporters@gmail.com';

    //////////////////// GET CUSTOMER PROFILE DETAILS ////////////////////
    const data = await fetch(`https://api.paystack.co/customer/${email}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:::'+data);

    const response_customer_details = await data.json();
    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:::1'+JSON.stringify(response_customer_details));
    if (
      data.ok == false ||
      response_customer_details.data.dedicated_accounts == undefined ||
      response_customer_details.data.dedicated_accounts.length == null ||
      response_customer_details.data.dedicated_accounts.length == 0
    ) {
      return NextResponse.json(
        {
          customerDetails: [],
          transactionDetails: [],
          statusx: 'NO_ACCOUNT',
          message: 'No Dedicated Account found for this email',
        },
        { status: 200 },
      );
    }

    ////////// INITIALIZE CUSTOMER DATA //////////
    let customerData = {
      bankName: null,
      bankAccountName: null,
      bankAccountNumber: null,
      currency: null,
    };

    if (data.ok) {
      customerData = {
        bankName: response_customer_details.data.dedicated_account.bank.name,
        bankAccountName:
          response_customer_details.data.dedicated_account.account_name,
        bankAccountNumber:
          response_customer_details.data.dedicated_account.account_number,
        currency: response_customer_details.data.dedicated_account.currency,
      };
    }

    if (!data.ok) {
      return NextResponse.json(
        {
          customerDetails: [],
          transactionDetails: [],
          statusx: 'NO_ACCOUNT',
          message: 'No Dedicated Account found for this email',
        },
        { status: 200 },
      );
    }

    //////////////////// GET CUSTOMER TRANSACTIONS ////////////////////
    const customer_id = response_customer_details.data.id;
    //console.log('Customer ID:', customer_id);
    const datav = await fetch(
      `https://api.paystack.co/transaction?customer=${customer_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        },
      },
    );
    const response_transaction = await datav.json();
    //console.log(':::::::::::::::::::PLAY:::::::::::::::::::'+response_transactionx);

    const filteredTransaction = response_transaction.data.filter(
      (transaction: any) =>
        //transaction.customer.email.toLowerCase() === email.toLowerCase() &&
        //transaction.status.toLowerCase() === 'success',
        transaction.channel.toLowerCase() === 'dedicated_nuban',
    );

    //console.log(':::::::::::::::::::Response Transaction:::::::::::::::::::'+filteredTransactionx);

    function calculateTotalAmount(transactions: any): any {
      return transactions.reduce((total: any, transaction: any) => {
        // Only sum successful transactions
        if (transaction.status === 'success') {
          return total + transaction.amount;
        }
        return total;
      }, 0);
    }

    //calculate total amount
    const totalAmount = calculateTotalAmount(filteredTransaction);

    //initialize transaction data
    let transactionData = {
      transactions: [],
      totalAmount: 0  - totalDebit,
      totalDebit: totalDebit,
    };
    if (
      filteredTransaction.length > 0 ||
      !filteredTransaction[0] == undefined
    ) {
      transactionData = {
        transactions: filteredTransaction,
        totalAmount: (totalAmount / 100) - totalDebit,
        totalDebit: totalDebit,
      };
    } else {
    }

    //console.log(':::::::::::::::::::TOTAL:::::::::::::::::::'+totalAmountx);

    //////////////////// GET CUSTOMER TRANSACTIONS ////////////////////
    // const response_transaction = await fetch(
    //   `https://api.paystack.co/transaction?perPage=1000`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
    //     },
    //   },
    // );

    // const dataz = await response_transaction.json();
    // const channel = 'dedicated_nuban';

    // //if (!transactionsData?.data) return [];

    // const filteredTransaction = dataz.data.filter(
    //   (transaction: any) =>
    //     transaction.customer.email.toLowerCase() === email.toLowerCase() &&
    //     transaction.channel.toLowerCase() === channel.toLowerCase(),
    // );

    // function calculateTotalAmount(transactions: any): any {
    //   return transactions.reduce((total: any, transaction: any) => {
    //     // Only sum successful transactions
    //     if (transaction.status === 'success') {
    //       return total + transaction.amount;
    //     }
    //     return total;
    //   }, 0);
    // }

    // //calculate total amount
    // const totalAmount = calculateTotalAmount(filteredTransaction);

    // //initialize transaction data
    // let transactionData = {
    //   transactions: [],
    //   totalAmount: 0,
    // };
    // if (
    //   filteredTransaction.length > 0 ||
    //   !filteredTransaction[0] == undefined
    // ) {
    //   transactionData = {
    //     transactions: filteredTransaction,
    //     totalAmount: totalAmount / 100,
    //   };
    // } else {
    // }

    ////////// ACCOUNT FOUND //////////
    return NextResponse.json(
      {
        customerDetails: customerData,
        transactionDetails: transactionData,
        statusx: 'WALLET_READY',
        message: 'Wallet Activation was Successful!',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
