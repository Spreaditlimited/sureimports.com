'use client';

import React, { useState, useEffect } from 'react';
import CustomSelect from '../global/CustomSelect';
import Image from 'next/image';
import cards from '@/public/assets/img/payment-buy.png';
import { motion } from 'framer-motion';
import PaystackButtonFaya from '@/components/paystack/PaystackButtonFaya';
import { timeStamp } from 'console';
import { toast } from 'sonner';
import router from 'next/router';
import ChevronUpDownIcon from '@heroicons/react/16/solid/ChevronUpDownIcon';
import CheckIcon from '@heroicons/react/16/solid/CheckIcon';
import { visibility } from 'html2canvas/dist/types/css/property-descriptors/visibility';
import randomGenerator from '@/lib/helpers/randomGenerator';
import { PaystackButton } from '@/components/paystackv2/PaystackButton';

interface tabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Checkout({ activeTab, setActiveTab }: tabProps) {
  const getInitialQuantity = (tab: string) =>
    tab === 'Bulk Buy 2M Cable' ? 50 : 1;

  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(7000);
  const [purchaseType, setPurchaseType] = useState('single'); // 'single' or 'bulk'
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [visibilityAddress, setVisibilityAddress] = useState<true | false>(
    false,
  );

  const [value, setValue] = useState({
    quantity: getInitialQuantity(activeTab),
    price: 7000,
    deliveryOption: 'Pay and Pick up',
    total: 7000,
  });

  const setDeliveryOption = (deliveryOption: string) => {
    setValue((prev) => ({ ...prev, deliveryOption }));
  };

  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    // Reset quantity when tab changes
    setValue((prev) => ({
      ...prev,
      quantity: getInitialQuantity(activeTab),
    }));
  }, [activeTab]);

  useEffect(() => {
    let price = 7000;
    let deliveryMsg = '';

    if (activeTab === 'Bulk Buy 2M Cable') {
      price = value.quantity >= 100 ? price * 0.6 : price * 0.7;

      setPurchaseType('bulk');

      if (value.deliveryOption === 'Pay and Pick up') {
        setDeliveryCost(0);
        setVisibilityAddress(false);
      }

      if (value.deliveryOption === 'Pay before Delivery') {
        setVisibilityAddress(true);
      }

      // FOR BULK BUY
      switch (value.deliveryOption) {
        case 'Pay and Pick up':
          setDeliveryCost(0);
          deliveryMsg =
            'For "Pay and Pick up", you can pick up at our Lagos office address - Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos.';
          break;
        case 'Pay before Delivery':
          deliveryMsg =
            'For "Pay before Delivery", provide your delivery address below and we’ll deliver to you.';
          //setVisibilityAddress(true);
          break;
          // case 'Pay on Delivery':
          //   deliveryMsg =
          //     'Pay on Delivery is not available for Bulk Buy. Please choose another option.';
          break;
        default:
          deliveryMsg = '';
      }
    } else {
      // FOR SINGLE BUY

      setPurchaseType('single');

      if (value.deliveryOption === 'Pay and Pick up') {
        setDeliveryCost(0);
        setVisibilityAddress(false);
        setSelectedOption('');
      }

      if (value.deliveryOption === 'Pay before Delivery') {
        setDeliveryCost(deliveryCost || 0);
        setVisibilityAddress(true);
      }

      switch (value.deliveryOption) {
        case 'Pay and Pick up':
          setDeliveryCost(0);
        case 'Pay before Delivery':
          deliveryMsg =
            value.deliveryOption === 'Pay and Pick up'
              ? 'For "Pay and Pick up", you can pick up at our Lagos office address - Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos.'
              : 'For "Pay before Delivery", provide your delivery address below and we’ll deliver to you.';
          price = price;

          break;
        // case 'Pay on Delivery':
        //   deliveryMsg =
        //     'Get a 10% discount if you select Pay and Pick up or Pay before Delivery.';
        // break;
        default:
          deliveryMsg = '';
      }
    }

    setValue((prev) => ({
      ...prev,
      price,
      total: price * prev.quantity + deliveryCost,
    }));
    setMessage(deliveryMsg);
  }, [activeTab, value.quantity, value.deliveryOption, deliveryCost]);

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment initiated, reference:', reference);
    toast.info('Payment Successful!');
    router.push('/faya-purchase-success');
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

  //const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const options: any[] = [
    { value: '', label: 'Select your location', disabled: true },
    { value: 'lagos', label: 'Lagos (₦3,225)' },
    { value: 'oyo', label: 'Oyo (₦4,569)' },
    { value: 'ondo', label: 'Ondo (₦4,569)' },
    { value: 'osun', label: 'Osun (₦4,569)' },
    { value: 'ekiti', label: 'Ekiti (₦4,569)' },
    { value: 'ogun', label: 'Ogun (₦4,569)' },
    { value: 'akwa_ibom', label: 'Akwa Ibom (₦6,719)' },
    { value: 'cross_river', label: 'Cross River (₦6,719)' },
    { value: 'bayelsa', label: 'Bayelsa (₦5,644)' },
    { value: 'rivers', label: 'Rivers (₦5,644)' },
    { value: 'delta', label: 'Delta (₦5,644)' },
    { value: 'edo', label: 'Edo (₦5,644)' },
    { value: 'enugu', label: 'Enugu (₦5,644)' },
    { value: 'anambra', label: 'Anambra (₦5,644)' },
    { value: 'eboyin', label: 'Ebonyi (₦5,644)' },
    { value: 'imo', label: 'Imo (₦5,644)' },
    { value: 'abia', label: 'Abia (₦5,644)' },
    { value: 'niger', label: 'Niger (₦6,450)' },
    { value: 'benue', label: 'Benue (₦6,450)' },
    { value: 'nasarawa', label: 'Nasarawa (₦6,450)' },
    { value: 'plateau', label: 'Plateau (₦6,450)' },
    { value: 'kogi', label: 'Kogi (₦6,450)' },
    { value: 'abuja', label: 'Abuja (₦6,450)' },
    { value: 'kwara', label: 'Kwara (₦5,644)' },
    { value: 'jigawa', label: 'Jigawa (₦6,450)' },
    { value: 'kano', label: 'Kano (₦6,450)' },
    { value: 'katsina', label: 'Katsina (₦6,450)' },
    { value: 'kaduna', label: 'Kaduna (₦6,450)' },
    { value: 'zamfara', label: 'Zamfara (₦6,450)' },
    { value: 'sokoto', label: 'Sokoto (₦6,450)' },
    { value: 'kebbi', label: 'Kebbi (₦6,450)' },
    { value: 'gombe', label: 'Gombe (₦6,450)' },
    { value: 'bauchi', label: 'Bauchi (₦6,450)' },
    { value: 'yobe', label: 'Yobe (₦6,450)' },
    { value: 'borno', label: 'Borno (₦6,450)' },
    { value: 'adamawa', label: 'Adamawa (₦6,450)' },
    { value: 'taraba', label: 'Taraba (₦6,450)' },
  ];

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);

    setDeliveryCost(
      value === 'lagos'
        ? 3225
        : value === 'oyo' ||
            value === 'ondo' ||
            value === 'osun' ||
            value === 'ekiti' ||
            value === 'ogun'
          ? 4569
          : value === 'akwa_ibom' || value === 'cross_river'
            ? 6719
            : value === 'bayelsa' ||
                value === 'rivers' ||
                value === 'delta' ||
                value === 'edo'
              ? 5644
              : value === 'enugu' ||
                  value === 'anambra' ||
                  value === 'ebonyi' ||
                  value === 'imo' ||
                  value === 'abia'
                ? 5644
                : value === 'niger' ||
                    value === 'benue' ||
                    value === 'nasarawa' ||
                    value === 'plateau' ||
                    value === 'kogi' ||
                    value === 'abuja' ||
                    value === 'kwara'
                  ? 6450
                  : value === 'jigawa' ||
                      value === 'kano' ||
                      value === 'katsina' ||
                      value === 'kaduna' ||
                      value === 'zamfara' ||
                      value === 'sokoto' ||
                      value === 'kebbi'
                    ? 6450
                    : value === 'gombe' ||
                        value === 'bauchi' ||
                        value === 'yobe' ||
                        value === 'borno' ||
                        value === 'adamawa' ||
                        value === 'taraba'
                      ? 6450
                      : 0,
    );
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedOption)?.label ||
    'Select your location';

  return (
    <section
      id="buy-now"
      className="sm:pt-15 xl:pt-30 xl:pb-30 bg-white pt-[50px]"
    >
      <div className="mx-auto max-w-[1920px] xl:px-12 2xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto flex max-w-[1592px] flex-col items-center gap-[80px] gap-y-[104px] xl:flex-row 2xl:gap-[150px]"
        >
          <motion.p
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-[734px] flex-1 px-5 text-center text-[28px] font-medium leading-[150%] text-white sm:px-8 lg:px-12 lg:text-[40px] lg:leading-[175%] xl:px-0 xl:text-left 2xl:-mr-[24px]"
          >
            60W of clean, intelligent power, delivered in a single cord. And if
            reselling, it’s the cable your customers will proudly recommend to
            others.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex w-full flex-1 justify-center px-5 sm:px-8 lg:px-12 xl:mb-0 xl:px-0"
          >
            <div className="absolute -bottom-[2px] left-0 h-[55%] w-full bg-white xl:bg-transparent" />
            <form
              className="z-[2] w-full max-w-[700px] rounded-[30px] bg-white p-5 py-[30px] sm:p-[50px] sm:py-[50px]"
              style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.10)' }}
            >
              {/* Toggle Buttons */}
              <div className="tab-btn hide-scrollbar mx-auto flex max-w-[443px] justify-center gap-1 overflow-x-auto rounded-[50px] bg-[#F0F0F0]">
                {['Buy 2M Cable', 'Bulk Buy 2M Cable'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveTab(label)}
                    className={`flex-1 whitespace-nowrap rounded-[50px] py-2.5 text-[16px] font-medium transition-all duration-300 ease-linear sm:text-[18px] ${
                      activeTab === label
                        ? 'bg-[#3730A3] px-5 text-white sm:px-[30px]'
                        : 'px-4 text-[var(--dark-color)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h2 className="pb-5 pt-[30px] text-center text-[20px] font-semibold text-[#3730A3] sm:pb-[30px] md:text-[30px]">
                Buy Now
              </h2>

              {/* Form Fields */}
              <div className="flex flex-col gap-[25px]">
                {/* Quantity */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="quantity"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Select quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min={activeTab === 'Bulk Buy 2M Cable' ? 50 : 1}
                    className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                    placeholder="Enter quantity"
                    value={value.quantity}
                    onChange={(e) =>
                      setValue((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="Price_per_unit"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Price per unit
                  </label>
                  <input
                    type="number"
                    id="Price_per_unit"
                    value={value.price}
                    //onChange={(e) => setPricePerUnit(e.target.value)}
                    readOnly
                    className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                  />
                </div>

                {/* Delivery Option */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="delivery"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Delivery Option
                  </label>
                  <CustomSelect
                    value={value.deliveryOption}
                    setValue={setDeliveryOption}
                    options={
                      activeTab === 'Bulk Buy 2M Cable'
                        ? ['Pay and Pick up', 'Pay before Delivery']
                        : [
                            'Pay and Pick up',
                            'Pay before Delivery',
                            // 'Pay on Delivery',
                          ]
                    }
                  />
                </div>

                {message && (
                  <p className="text-center text-[16px] font-medium text-[#474747] sm:text-start sm:text-[14px]">
                    {message}
                  </p>
                )}

                {/* Delivery Location */}

                {visibilityAddress && (
                  <div className="flex flex-col gap-2.5">
                    <label
                      htmlFor="delivery"
                      className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                    >
                      Delivery Location
                    </label>

                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex w-full items-center justify-between rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear ${
                          isOpen ? 'ring-2 ring-blue-500' : 'hover:bg-gray-200'
                        }`}
                      >
                        <span
                          className={
                            selectedOption === '' ? 'text-gray-400' : ''
                          }
                        >
                          {selectedLabel}
                        </span>
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg">
                          <ul className="max-h-60 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {options.map((option) => (
                              <li
                                key={option.value}
                                onClick={() =>
                                  !option.disabled && handleSelect(option.value)
                                }
                                className={`relative cursor-default select-none py-2 pl-3 pr-9 ${
                                  option.disabled
                                    ? 'cursor-not-allowed text-gray-400'
                                    : 'text-gray-900 hover:bg-blue-50'
                                } ${
                                  selectedOption === option.value
                                    ? 'bg-blue-100'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center">
                                  <span
                                    className={`ml-3 block truncate ${
                                      selectedOption === option.value
                                        ? 'font-semibold'
                                        : 'font-normal'
                                    }`}
                                  >
                                    {option.label}
                                  </span>
                                </div>

                                {selectedOption === option.value && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                    <CheckIcon className="h-5 w-5" />
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {selectedOption && (
                      <p className="mt-2 text-sm text-gray-600">
                        You selected:{' '}
                        <span className="font-medium">
                          {selectedOption.toLocaleUpperCase()}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="full_name"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    min={activeTab === 'Bulk Buy 2M Cable' ? 50 : 1}
                    className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                    placeholder="Enter Full Name"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="email"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    min={activeTab === 'Bulk Buy 2M Cable' ? 50 : 1}
                    className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2.5">
                  <label
                    htmlFor="phone"
                    className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                  >
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    // min={activeTab === 'Bulk Buy 2M Cable' ? 50 : 1}
                    className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2.5">
                  {visibilityAddress && (
                    <>
                      <label
                        htmlFor="phone"
                        className="text-[16px] font-medium text-[var(--dark-color)] sm:text-[14px]"
                      >
                        Delivery Address
                      </label>

                      <textarea
                        name="address"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        //onChange={handleChange}
                        //maxLength={maxLength}
                        rows={3}
                        className="w-full rounded-[10px] border border-transparent bg-[#F0F0F0] px-5 py-[9px] text-[16px] font-medium text-[#363636] outline-0 transition-all duration-300 ease-linear focus:border-black"
                        placeholder="Enter your delivery address here..."
                      />
                    </>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium text-[#363636] sm:text-[14px]">
                    Total amount
                  </p>
                  <span className="text-[20px] font-bold leading-[140%] text-[#3730A3] lg:text-[30px]">
                    ₦ {value.total.toLocaleString()}
                  </span>
                </div>

                <PaystackButton
                  title={' Pay Now '}
                  email={email}
                  amount={value.total} // Paystack requires amount in kobo
                  //amount={100}
                  pidUser={'faya_' + email}
                  pidProduct={('FAYA' + randomGenerator(10)) as any}
                  productPrice={pricePerUnit as any}
                  productName={'FAYA 60W PD 2m Cable'}
                  quantity={value.quantity as any}
                  currency={'NGN'}
                  serviceID={('FAYA' + randomGenerator(10)) as any}
                  serviceName={'FAYASTORE'}
                  serviceDescription={'Online Faya Purchase'}
                  publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
                  activeTab={activeTab}
                  purchaseType={purchaseType}
                  fullName={full_name}
                  phone={phone}
                  address={address}
                  deliveryOption={value.deliveryOption}
                  deliveryLocation={selectedOption}
                  metadata={{
                    custom_fields: [
                      {
                        display_name: 'Invoice ID',
                        variable_name: 'invoice_id',
                        value: '209',
                      },
                    ],
                  }}
                  disabled={
                    (activeTab === 'Bulk Buy 2M Cable' &&
                      value.quantity < 50) ||
                    value.quantity === 0 ||
                    !email ||
                    !full_name ||
                    !phone ||
                    (!address &&
                      value.deliveryOption == 'Pay before Delivery') ||
                    value.total <= 0
                  }
                  children={undefined}
                />

                {/* Payment Icons */}
                <Image
                  src={cards}
                  alt="card"
                  className="mt-[5px] w-full md:mt-[25px]"
                />
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
