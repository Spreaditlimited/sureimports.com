import React from 'react';
import OrderSection from '../../components/order-section';
import Orders from '@/content/general-procurement/completed-orders.json';

function CompletedOrders() {
  return (
    <div className="hide-scrollbar flex px-[25px] 2xl:justify-center">
      <OrderSection initialOrders={Orders} />
    </div>
  );
}

export default CompletedOrders;
