import React from 'react';
import OrderSection from '../../components/order-section';
import Orders from '@/content/general-procurement/ready-for-pickup.json';

function ReadyFroPickup() {
  return (
    <div className="hide-scrollbar flex px-[25px] 2xl:justify-center">
      <OrderSection initialOrders={Orders} />
    </div>
  );
}

export default ReadyFroPickup;
