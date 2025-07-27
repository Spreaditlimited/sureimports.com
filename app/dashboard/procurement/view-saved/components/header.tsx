'use client';

import OrderTypes from './order-types-bar';
import CreateOrder from '../../create-order/components/createOrder';
function Header() {
  return (
    <div className="px-3 py-[25px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[28px] font-bold capitalize text-slate-800 dark:text-white">
          General Procurement
        </div>
        <CreateOrder />
      </div>
      <div>
        <OrderTypes />
      </div>
    </div>
  );
}

export default Header;
