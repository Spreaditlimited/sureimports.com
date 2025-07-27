import React from 'react';
import OrderSection from '../../components/order-section';
import Orders from '@/content/general-procurement/pay-for-shipping.json';

function PayFroShipping() {
  return (
    <div className="hide-scrollbar flex px-[25px] 2xl:justify-center">
      <OrderSection initialOrders={Orders} />
    </div>
  );
}

export default PayFroShipping;
