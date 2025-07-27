export interface PaystackCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface PaystackResponse {
  status: boolean;
  message: string;
  data: PaystackCustomer;
}
