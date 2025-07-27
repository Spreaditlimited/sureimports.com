'use client';
import React, { useState } from 'react';
import { DelateIcon, DownIcon } from './Icons';

interface PhoneField {
  label: string;
  placeholder?: string;
  inputValue?: string;
  type?: string;
  options?: string[];
  phoneModal?: string[];
}

// Define the initial structure of a phone input group for iPhone and Samsung
const iPhoneData: PhoneField[] = [
  {
    label: 'Phone',
    placeholder: 'Phone',
    inputValue: 'iPhone',
    type: 'text',
  },
  {
    label: 'Condition',
    options: ['Used', 'New'],
  },
  {
    label: 'Phone Model',
    options: ['iPhone 13 Pro Max 256G', 'iPhone 13 Pro Max 256G'],
  },
  {
    label: 'Unit Price',
    placeholder: 'Unit Price',
    inputValue: '19.75 CN¥',
    type: 'text',
  },
  {
    label: 'Quantity',
    options: ['05', '10', '20'],
  },
  {
    label: 'Total Price',
    placeholder: 'Total Price',
    inputValue: '99.75 CN¥',
    type: 'text',
  },
];

const samsungData: PhoneField[] = [
  {
    label: 'Phone',
    placeholder: 'Phone',
    inputValue: 'Samsung',
    type: 'text',
  },
  {
    label: 'Condition',
    options: ['Used', 'New'],
  },
  {
    label: 'Phone Model',
    options: ['S24 Ultra 256G 12G RAM', 'S24 Ultra 256G 12G RAM'],
  },
  {
    label: 'Unit Price',
    placeholder: 'Unit Price',
    inputValue: '20.00 CN¥',
    type: 'text',
  },
  {
    label: 'Quantity',
    options: ['05', '10', '20'],
  },
  {
    label: 'Total Price',
    placeholder: 'Total Price',
    inputValue: '100.00 CN¥',
    type: 'text',
  },
];

const SelectPhone: React.FC = () => {
  const [phoneList, setPhoneList] = useState<PhoneField[][]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addPhone = (phoneData: PhoneField[]) => {
    setPhoneList([...phoneList, phoneData]);
    setDropdownOpen(false);
  };

  const deletePhone = (index: number) => {
    const updatedPhoneList = phoneList.filter((_, i) => i !== index);
    setPhoneList(updatedPhoneList);
  };

  return (
    <div className="pb-5">
      <div className="flex items-center justify-between p-[25px] align-middle">
        <div className="text-[20px] font-bold dark:text-slate-900">
          Select phone
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-800 px-4 py-2 text-base font-medium text-white ring-offset-background transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 xl:h-[44px] xl:w-[152px]"
          >
            Add Phone <DownIcon />
          </button>
          {dropdownOpen && (
            <div className="absolute top-10 mt-1 grid w-[100%] rounded-[10px] border border-indigo-200 bg-slate-100 py-2 text-left">
              <a
                className="cursor-pointer px-4 py-2 hover:bg-indigo-800 hover:text-white dark:text-slate-900 dark:hover:bg-indigo-200"
                onClick={() => addPhone(iPhoneData)}
              >
                iPhone
              </a>
              <a
                className="cursor-pointer px-4 py-2 hover:bg-indigo-800 hover:text-white dark:text-slate-900 dark:hover:bg-indigo-200"
                onClick={() => addPhone(samsungData)}
              >
                Samsung
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="select-phone-content mx-5">
        {phoneList.map((phoneData, phoneIndex) => (
          <div
            key={phoneIndex}
            className="grid grid-flow-col grid-rows-1 gap-3"
          >
            {phoneData.map((item, inputIndex) => (
              <div key={inputIndex} className="f-phoneSelectItems mb-4">
                <label className="grid pb-2 text-left text-[14px] font-medium text-[#475569] dark:text-gray-300">
                  {item.label}
                </label>

                {item.type === 'text' ? (
                  <input
                    type="text"
                    placeholder={item.placeholder}
                    value={item.inputValue}
                    className={`flex h-[50px] w-full items-center rounded-[10px] border-none bg-slate-100 px-4 py-2 text-base font-medium text-slate-600 placeholder-slate-600 ring-offset-background placeholder:text-[16px] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300`}
                  />
                ) : item.options ? (
                  <select
                    className={`flex h-[50px] w-full appearance-none items-center rounded-[10px] border-none bg-slate-100 py-2 pl-[15px] pr-10 text-base font-medium text-slate-600 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300`}
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
                ) : null}
              </div>
            ))}
            <div className="mt-2">
              <label className="block text-left text-[14px] font-medium text-[#fff]">
                .{' '}
              </label>
              <button
                onClick={() => deletePhone(phoneIndex)}
                className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#FEE2E2] align-middle"
              >
                <DelateIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPhone;
