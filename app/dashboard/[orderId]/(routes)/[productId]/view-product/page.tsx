import AddProductModal from './components/view-product-modal';
import React from 'react';

function AddProduct() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800">
      <div className="flex flex-col pl-6 pt-6 text-[28px] font-bold text-slate-800 dark:text-white lg:flex-row lg:items-center lg:gap-3">
        Product View
        <span className="text-base font-normal text-slate-800 dark:text-slate-400">
          (Procurement & Shipping)
        </span>
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-[#161629]">
        <div>
          <AddProductModal />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
