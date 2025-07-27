'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Check, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiMoney } from 'react-icons/bi';
import Paystack from '@/components/uix/Paystack';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';

export default function ProductDetails({ product }: any) {
  const router = useRouter();

  const { user } = useAuth();

  //calculate 5% of product price
  let price = product.productPrice + product.productPrice * 0.05;

  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [email, setEmail] = useState(user?.userEmail);
  const [pidProduct, setPidProduct] = useState(product.pidProduct);
  const [phone, setPhone] = useState<number>(0);
  const [amount, setAmount] = useState(price);
  const [quantity, setQuantity] = useState(1);
  //let productID = 'PS' + new Date().getTime().toString();

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log(file);
    //setLoading(true);

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;

    formData.append('pidUser', pidUser);
    formData.append('userEmail', email);
    formData.append('pidProduct', pidProduct);
    formData.append('phone', phone);
    formData.append('amount', amount);
    formData.append('quantity', quantity);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');
      //MAKE REQUEST
      const res = await fetch('/api/crud/pay-small-small/add-product', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.statusx == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/pay-small-small?status=SAVED',
          'success',
          data.message,
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   openModal();
      //   toast.success(data.responsex.message);
      // }
      if (data.statusx == 'NO_PHONE_NUMBER') {
        toast.warning(data.message);
      }
      if (data.statusx == 'FAILED') {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

  return (
    <div className="mx-autox max-w-7xlx m-7 mb-14 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={
                (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                  '/' +
                  `${product.productImage}`) as string
              }
              alt="Product Image"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-purple-400">
              <b>Pay Small Small</b>
            </h2>
            <br />
            <hr />
            <br />
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {product.productBrand}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.productName}
            </h1>

            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₦
              {
                parseFloat(amount)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
              }
            </p>
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <i>Inclusive of 5% PSS Fee</i>
            </div>
          </div>

          {/* <div className="items-center space-x-4 sm:flex">
            <div className="m-3 flex w-fit items-center rounded-md border border-gray-300 dark:border-gray-700">
              <button
                onClick={decrementQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                -
              </button>
              <span className="px-3 py-1 text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>
          </div> */}
          <form onSubmit={submitForm}>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Thank you for choosing the “Pay Small Small” option on
                SureImports.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                This flexible payment plan allows you to pay for your selected
                product in convenient installments over a maximum period of 6
                months. Once your payment is complete, your item will be shipped
                from China to Lagos, Nigeria.
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                <b>Here’s how it works:</b>
                <ul className="list-disc text-pretty pl-5">
                  <li>
                    When you click the button below, a virtual payment account
                    will be created for you. You can pay into this account at
                    your own pace, as long as full payment is completed within 6
                    months.
                  </li>
                  <li>
                    All payments made through this plan attract a 5% additional
                    fee. This helps us manage exchange rate fluctuations in
                    Nigeria and charges from our payment processor.
                  </li>
                  <li>
                    Your product will only be shipped after full payment has
                    been received.
                  </li>
                  <li className="text-orange-600">
                    To activate your pay small small account, you’ll be required
                    to make a deposit of N5,000 to the dedicated virtual account
                    created for you.
                  </li>
                  <li className="text-orange-600">
                    You can choose to cancel at any time. In such cases, we will
                    process a refund of the total amount paid, less 2.5% to
                    cover administrative costs.
                  </li>
                </ul>
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                To proceed, please ensure your SureImports account profile
                includes your phone number. If it’s missing, kindly enter it
                below:
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Phone Number:
                <input
                  type="number"
                  name="phone"
                  id="phone"
                  placeholder="Enter a valid phone number"
                  onChange={(e) => setPhone(parseInt(e.target.value))}
                  className="mb-4 w-full rounded-md border border-gray-300 p-2"
                />
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Once ready, click the button below to begin.
              </p>
            </div>

            <br />
            <hr />
            <br />

            <button
              type="submit"
              // onClick={() =>
              //   alert('Pay Small Small is Coming Soon, check back later')
              // }
              className="flex w-full flex-1 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-[clamp(12px,3vw,16px)] font-medium text-white transition-colors hover:bg-purple-700"
            >
              <User className="mr-2 flex h-4 w-4" />
              Add Product to Pay Small Small
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
function navigateWithAlert(arg0: string, arg1: string, arg2: string) {
  throw new Error('Function not implemented.');
}
