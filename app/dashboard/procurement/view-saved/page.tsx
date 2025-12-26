import React from 'react';
import OrderSection from './components/order-section';
import Orders from '@/content/general-procurement/saved-orders.json';

function ApprovedOrders() {
  return (
    <div className="hide-scrollbar flex px-[25px] dark:bg-black 2xl:justify-center">
      <OrderSection initialOrders={Orders} />
    </div>
  );
}

export default ApprovedOrders;
