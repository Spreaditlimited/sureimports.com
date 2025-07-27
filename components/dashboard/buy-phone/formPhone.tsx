'use client';
import React from 'react';
import { CountryIcon, PhoneIcon } from './Icons';
import SelectPhone from './selectPhone';

function FormPhone() {
  return (
    <div className="mt-5 rounded-[12px] bg-white shadow-[0px_4px_74px_0px_rgba(0,0,0,0.04)] dark:bg-slate-900">
      <div className="p-[25px] text-[20px] font-bold dark:text-slate-300">
        Buy iPhones and Samsung Phones From China
      </div>
      <hr />
      <div className="grid grid-cols-1 gap-4 p-[25px] text-[#475569] md:grid-cols-12">
        {formData.map((item, index) => (
          <div key={index} className={`fs-custome_grid col-span-${item.col}`}>
            <label className="block text-sm font-medium leading-6 dark:text-gray-300">
              {item.labelText}
            </label>

            <div className="relative mt-2 rounded-md text-[#475569] shadow-sm">
              {item.icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">{item.icon}</span>
                </div>
              )}

              {item.options ? (
                <select
                  className={`flex h-[50px] w-full items-center rounded-[10px] border-none bg-slate-100 text-[#475569] dark:text-gray-300 ${
                    item.icon ? 'pl-[45px]' : 'pl-[15px]'
                  } appearance-none py-2 pr-10 text-base font-medium text-slate-500 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cg clip-path='url(%23clip0_970_3224)'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23475669' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_970_3224'%3E%3Crect width='20' height='20' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 10px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '20px',
                    fontSize: '15px',
                  }}
                >
                  {item.options.map((option, idx) => (
                    <option key={idx}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={item.type}
                  placeholder={item.place}
                  className={`flex h-[50px] w-full items-center rounded-[10px] border-none bg-slate-100 dark:text-gray-300 ${
                    item.icon ? 'pl-[45px]' : 'pl-[15px]'
                  } py-2 text-base font-medium text-slate-600 placeholder-slate-600 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[16px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <hr />

      <SelectPhone />

      <hr />
      <div className="px-5 pb-5 pt-5">
        <div className="text-[14px] text-[#475569] dark:text-gray-300">
          Grand Total Cost:
          <span className="text-[24px] font-bold text-[#3E4095] dark:text-gray-300 md:ml-10">
            {' '}
            99.75 CN¥{' '}
          </span>{' '}
          or{' '}
          <span className="text-[24px] font-bold text-[#22C55E] dark:text-gray-300">
            {' '}
            ₦84,783.25 Naira{' '}
          </span>
        </div>
        <p className="pb-8 pt-3 text-[16px] text-[#475569] dark:text-gray-300">
          The phone prices include our best estimates of delivery cost to your
          country. Based on the zip code you’ve provided, there may be
          additional costs. We will communicate this to you via the WhatsApp
          number you’ve provided.
        </p>
        <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-4 py-2 text-base font-medium text-white ring-offset-background transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 xl:h-[54px] xl:w-[206px]">
          Pay Now
        </button>
      </div>
    </div>
  );
}

const formData = [
  {
    labelText: 'Country',
    type: 'select',
    options: ['Which Country are you Shipping to?', 'USA', 'China', 'Germany'],
    icon: <CountryIcon />,
    col: '6',
  },
  {
    labelText: 'Whatsapp number',
    place: 'Enter your WhatsApp number',
    type: 'text',
    icon: <PhoneIcon />,
    col: '6',
  },
  {
    labelText: 'City',
    place: 'Enter city name',
    type: 'text',
    col: '4',
  },
  {
    labelText: 'Street Address',
    place: 'Enter street address',
    type: 'text',
    col: '4',
  },
  {
    labelText: 'Zip/postal Code',
    place: 'Enter zip/postal code',
    type: 'text',
    col: '4',
  },
];

export default FormPhone;
