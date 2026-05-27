import React from 'react';
import Image from 'next/image';
import { FaPhone } from 'react-icons/fa';

interface Props {
  label: string;
  name: string;
  id: string;
  defaultValue?: any;
  reacticon?: any;
  autoComplete?: string;
  placeholder?: string;
  classx?: string;
  errorx?: any;
  xrecords: any;
  value?: string;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  onSelect?: (e: any) => void;
}

const RadText: React.FC<Props> = ({
  label,
  name,
  id,
  defaultValue,
  reacticon,
  autoComplete,
  placeholder,
  classx,
  errorx,
  xrecords,
  value,
  onClick,
  onChange,
  onSelect,
}) => {
  let classprops =
    'flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset sm:max-w-md ';
  return (
    <>
      {/* TEXT INPUT */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-400">
          {label}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#404040]">
            {reacticon}
          </span>
          <select
            id={id}
            name={name}
            value={value}
            onClick={onClick}
            onChange={onChange}
            onSelect={onSelect}
            //autoComplete="country-name"
            defaultValue={defaultValue}
            className="items-centerx max-sm:w-340px flex h-10 w-full appearance-none justify-between rounded-md border border-input bg-background bg-slate-100 p-5 px-3 py-2 pl-16 text-left text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 lg:h-[60px] lg:w-full [&>span]:line-clamp-1"
          >
            {/** LOOP RECORDS STARTS */}
            {xrecords.map((datax: any, index: number) => {
              const optionKey =
                datax?.id ?? datax?.optionValue ?? datax?.optionName ?? index;

              return (
                <option
                  key={String(optionKey)}
                  value={datax.optionValue}
                  defaultValue={datax.optionValue}
                >
                  {datax.optionName}
                </option>
              );
            })}
            {/** LOOP RECORDS ENDS */}
          </select>
        </div>
        <div id="question-error" aria-live="polite" aria-atomic="true">
          <p className="mt-2 text-sm text-red-500">{errorx}</p>
        </div>
      </div>
    </>
  );
};

export default RadText;
