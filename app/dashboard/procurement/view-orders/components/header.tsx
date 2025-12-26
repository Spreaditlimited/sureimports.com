'use client';

import OrderTypes from './order-types-bar';
import CreateOrder from '../../create-order/components/createOrder';
function Header() {
  return (
    <div className="px-3 py-[25px] dark:bg-black">
      <div className="flex flex-col dark:bg-black sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[28px] font-bold capitalize text-slate-800 dark:bg-black dark:text-white">
          Buy from Chinese Websites
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
