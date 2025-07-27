import React from 'react';
import SpecialSourcingForm from '../../components/FormVerifySupplier';
// import SpecialInstructions from './components/special-instructions';

function SpecialSourcing() {
  return (
    <div className="h-full">
      <div className="p-[25px]">
        <div className="text-[28px] font-bold text-slate-800 dark:text-white max-sm:pb-4">
          Request for Special Sourcing
        </div>
        <div className="text-base font-normal text-slate-600 dark:text-slate-300 xl:w-[930px]">
          Just tell us what you want to buy from China, pay a refundable product
          sourcing commitment fee, and we get started. We will refund you when
          you go ahead with the order.{' '}
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-slate-50 px-4 dark:bg-slate-800 lg:flex-row xl:items-start">
        <div className="w-full">
          <SpecialSourcingForm />
        </div>
        <div>{/* <SpecialInstructions /> */}</div>
      </div>
    </div>
  );
}

export default SpecialSourcing;
