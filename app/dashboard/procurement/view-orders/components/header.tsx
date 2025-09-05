'use client';

import OrderTypes from './order-types-bar';
import CreateOrder from '../../create-order/components/createOrder';
function Header() {
  return (
    <div className="px-3 py-[25px] dark:bg-black">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between dark:bg-black">
        <div className="text-[28px] font-bold capitalize text-slate-800 dark:text-white dark:bg-black">
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
