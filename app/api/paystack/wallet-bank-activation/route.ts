import { NextResponse } from 'next/server';
import https from 'https';

type PaystackDedicatedAccountResponse = {
  status: boolean;
  message: string;
  data?: any;
};

type RequestBody = {
  customer: number;
  preferred_bank: string;
};

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { customer, preferred_bank } = body;

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Request body:', body);
    // Validate input
    if (!customer || !preferred_bank) {
      return NextResponse.json(
        {
          status: false,
          message: 'Customer ID and preferred bank are required',
        },
        { status: 400 },
      );
    }

    const params = JSON.stringify({
      customer,
      preferred_bank,
    });

    const paystackResponse =
      await new Promise<PaystackDedicatedAccountResponse>((resolve, reject) => {
        const options = {
          hostname: 'api.paystack.co',
          port: 443,
          path: '/dedicated_account',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        };

        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const responseData = JSON.parse(data);
              resolve({
                status: responseData.status,
                message: responseData.message,
                data: responseData.data,
              });
            } catch (error) {
              reject(new Error('Error parsing Paystack response'));
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(params);
        req.end();
      });

    return NextResponse.json(paystackResponse);
  } catch (error) {
    console.error('Paystack dedicated account error:', error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 },
    );
  }
}
