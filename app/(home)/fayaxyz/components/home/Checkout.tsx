'use client';

import React, { useState, useEffect } from 'react';
import CustomSelect from '../global/CustomSelect';
import Image from 'next/image';
import cards from '@/public/assets/img/payment-buy.png';
import bkgImage from '@/public/assets/img/checkout-bg.png';
import { motion } from 'framer-motion';

interface tabProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Checkout({ activeTab, setActiveTab }: tabProps) {
  const getInitialQuantity = (tab: string) =>
    tab === 'Bulk Buy 2M Cable' ? 50 : 1;

  const [message, setMessage] = useState('');

  const [value, setValue] = useState({
    quantity: getInitialQuantity(activeTab),
    price: 7000,
    deliveryOption: 'Pay and Pick up',
    total: 7000,
  });

  const setDeliveryOption = (deliveryOption: string) => {
    setValue((prev) => ({ ...prev, deliveryOption }));
  };

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

      switch (value.deliveryOption) {
        case 'Pay and Pick up':
          deliveryMsg =
            'You can pick up at our Lagos office address - Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos.';
          break;
        case 'Pay before Delivery':
          deliveryMsg =
            'You’ll provide your delivery address on the next screen after you click “Pay Now”.';
          break;
        case 'Pay on Delivery':
          deliveryMsg =
            'Pay on Delivery is not available for Bulk Buy. Please choose another option.';
          break;
        default:
          deliveryMsg = '';
      }
    } else {
      switch (value.deliveryOption) {
        case 'Pay and Pick up':
        case 'Pay before Delivery':
          deliveryMsg =
            '10% discount applied. ' +
            (value.deliveryOption === 'Pay and Pick up'
              ? 'You can pick up at our Lagos office address - Sure Imports, 5 Olutosin Ajayi (Martins Adegboyega) Street, Ajao Estate, Lagos.'
              : 'You’ll provide your delivery address on the next screen after you click “Pay Now”.');
          price = price * 0.9;
          break;
        case 'Pay on Delivery':
          deliveryMsg =
            'Get a 10% discount if you select Pay and Pick up or Pay before Delivery.';
          break;
        default:
          deliveryMsg = '';
      }
    }

    setValue((prev) => ({
      ...prev,
      price,
      total: price * prev.quantity,
    }));
    setMessage(deliveryMsg);
  }, [activeTab, value.quantity, value.deliveryOption]);

  return (
    <section
      id="buy-now"
      className="sm:pt-15 xl:pt-30 xl:pb-30 pb-10x mb-10 pt-[50px] xl:mb-28"
      style={{
        backgroundImage: "url('/assets/img/checkout-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="mx-auto max-w-[1920px] sm:pb-16 xl:px-12 xl:pb-28 xl:pt-16 2xl:px-16">
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
                            'Pay on Delivery',
                          ]
                    }
                  />
                </div>

                {message && (
                  <p className="text-center text-[16px] font-medium text-[#363636] sm:text-start sm:text-[14px]">
                    {message}
                  </p>
                )}

                {/* Total */}
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-medium text-[#363636] sm:text-[14px]">
                    Total amount
                  </p>
                  <span className="text-[20px] font-bold leading-[140%] text-[#3730A3] lg:text-[30px]">
                    ₦ {value.total.toLocaleString()}
                  </span>
                </div>

                {/* Pay Now Button */}
                <button
                  className="w-full rounded-[50px] bg-[#3730A3] px-[30px] py-2.5 text-[16px] font-medium leading-[150%] text-white transition-all duration-200 ease-linear hover:opacity-90 disabled:!cursor-not-allowed disabled:opacity-50 md:text-[18px] md:leading-[200%]"
                  disabled={
                    (activeTab === 'Bulk Buy 2M Cable' &&
                      value.quantity < 50) ||
                    value.quantity === 0
                  }
                >
                  Pay Now
                </button>

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
