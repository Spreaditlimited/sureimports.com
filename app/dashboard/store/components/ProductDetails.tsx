'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BiMoney } from 'react-icons/bi';
import Paystack from '@/components/uix/Paystack';
import { useAuth } from '@/app/context/AuthContext';
import PaystackButton from '@/components/paystack/PaystackButton';
import { toast } from 'sonner';

export default function ProductDetails({ product }: any) {
  const router = useRouter();
  const { user } = useAuth();

  const [pidUser, setPidUser] = useState(user?.pidUser as string);
  const [email, setEmail] = useState(user?.userEmail as string);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.productPrice as number);
  const [amount, setAmount] = useState(product.productPrice as number);

  const [activeTab, setActiveTab] = useState('description');
  const [showTooltip, setShowTooltip] = useState(false);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
    setPrice((quantity + 1) * (product.productPrice as number));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    setPrice((quantity - 1) * (product.productPrice as number));
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment initiated, reference:', reference);
    toast.info('Payment Successful!');
    router.push('/dashboard/success/payment');
  };

  const handlePaymentClose = () => {
    console.log('Payment was closed');
    toast.info('Payment was closed');
    router.push('/dashboard/failed/payment');
  };

  const handleVerificationComplete = (success: boolean, data?: any) => {
    if (success) {
      console.log('Payment successful:', data);
    } else {
      console.log('Payment failed:', data);
      toast.info('Payment Failed!');
    }
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
          {/* <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer border-2 border-transparent hover:border-blue-500"
              >
                <img
                  src={`/placeholder.svg?height=150&width=150`}
                  alt={`Product thumbnail ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div> */}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {product.productBrand}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.productName}
            </h1>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                5.0{' '}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₦
              {
                parseFloat(price as any)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
              }
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              MOQ - {product.productMOQ}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {product.productDescription}
            </p>
          </div>

          <div className="items-center sm:flex md:space-x-4 lg:space-x-4">
            <div className="mb-5 flex w-fit items-center rounded-md border border-gray-300 px-4 py-2 align-middle dark:border-gray-700 xl:mb-0">
              <button
                onClick={decrementQuantity}
                className="py-1x px-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                -
              </button>

              <span className="py-1x px-3 text-gray-900 dark:text-white">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className="py-1x px-3 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                +
              </button>
            </div>

            <PaystackButton
              title={' Pay '}
              email={email}
              amount={amount * quantity} // Paystack requires amount in kobo
              pidUser={pidUser}
              pidProduct={product.pidProduct}
              productPrice={product.productPrice as any}
              productName={product.productName}
              quantity={quantity as any}
              currency={'NGN'}
              serviceID={product.pidProduct}
              serviceName={'SURESTORE'}
              serviceDescription={'Online Purchase'}
              publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
              onVerificationComplete={handleVerificationComplete}
              metadata={{
                custom_fields: [
                  {
                    display_name: 'Payment For',
                    variable_name: 'payment_for',
                    value: 'Online Purchase',
                  },
                ],
              }}
            />

            <div className="relative">
              <button
                disabled
                onClick={() =>
                  //alert('Pay Small Small is Coming Soon, check back later')
                  router.push(
                    '/dashboard/store/pay-small-small-terms?id=' + product.pidProduct,
                  )
                }
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="mt-5 flex w-full flex-1 items-center justify-center rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 xl:mt-0"
              >
                <BiMoney className="mr-2 h-6 w-6" />
                Pay Small Small
              </button>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-gray-700">
                  <div className="whitespace-nowrap">
                    Pay Small Small is Coming Soon, check back later
                  </div>
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </div>

            {/* <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Heart className="h-4 w-4" />
            </button> */}
            {/* <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
              <Share2 className="h-4 w-4" />
            </button> */}
          </div>

          <hr />

          <button
            onClick={() => router.push('/dashboard/store?id=laptop')}
            className="mt-3 flex flex-1 items-center justify-center rounded-md bg-slate-600 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Back to Store
          </button>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-10 mt-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="-mb-px grid grid-cols-3">
            <button
              onClick={() => setActiveTab('description')}
              className={`inline-block p-4 text-center ${
                activeTab === 'description'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`inline-block p-4 text-center ${
                activeTab === 'features'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              //onClick={() => router.push('/dashboard/store/pay-small-small?id=laptop')}
              className={`inline-block p-4 text-center ${
                activeTab === 'specifications'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Pay Small Small
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-0 rounded-b-md border border-t-0 p-4 text-gray-700 dark:text-gray-300">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.productDescription}</p>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <ul className="space-y-3">{product.productFeature}</ul>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              <div>
                <p>{product.productSpecification}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
