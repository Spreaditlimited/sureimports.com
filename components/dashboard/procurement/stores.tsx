import React from 'react';
import Storecard from './storecard';
import { StoreItems } from './storedetails';

interface StoreItems {
  title: string;
  icon: string;
  href?: string;
}

function Stores() {
  return (
    <div className="align-center max-xl:grid-col-3 grid gap-5 bg-slate-50 text-slate-800 dark:bg-gray-900 dark:text-white md:grid-cols-3 lg:pl-0 xl:ml-0 xl:mr-0 xl:grid-cols-4 2xl:grid-cols-5">
      {StoreItems.map((Item) => (
        <div key={Item.title}>
          <Storecard title={Item.title} icon={Item.icon} href={Item.href} />
        </div>
      ))}
    </div>
  );
}

export default Stores;
