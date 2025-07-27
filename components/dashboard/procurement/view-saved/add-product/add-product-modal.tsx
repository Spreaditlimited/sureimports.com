import React from 'react';
import AddProductForm from './add-product-form';

function AddProductModal() {
  return (
    <div>
      <div className="border-b py-5 pl-6 text-xl font-bold text-slate-800 dark:text-slate-300">
        Male winter shoes in black{' '}
      </div>
      <div className="pl-6 pt-6">
        <AddProductForm />
      </div>
    </div>
  );
}

export default AddProductModal;
