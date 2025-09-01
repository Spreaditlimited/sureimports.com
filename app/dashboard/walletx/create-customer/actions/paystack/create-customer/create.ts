// app/actions/paystack.ts
'use server';

interface CustomerData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any;
}

export async function createPaystackCustomer(
  customerData: CustomerData,
): Promise<PaystackResponse> {
  try {
    const response = await fetch('https://api.paystack.co/customer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_SECRET_PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    const data: PaystackResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create customer');
    }

    return data;
  } catch (error: any) {
    console.error('Paystack API error:', error);
    throw new Error(error.message || 'Failed to create customer');
  }
}
