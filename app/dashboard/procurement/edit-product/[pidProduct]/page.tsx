import React from 'react';
import EditProductForm from './components/edit-product-form';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function AddProduct(props: { params: Promise<{ pidProduct: string }> }) {
  const params = await props.params;
  const productID = params.pidProduct;

  //const products = await prisma.products.findMany()
  const product: any = await prisma.products.findUnique({
    where: {
      pidProduct: productID,
    },
  });

  return (
    <div className="bg-slate-100 dark:bg-black">
      <div className="flex flex-col pl-6 pt-6 text-[28px] font-bold text-slate-800 dark:text-white lg:flex-row lg:items-center lg:gap-3">
        Edit product
        <span className="text-base font-normal text-slate-800 dark:text-slate-400">
          (Procurement & Shipping)
        </span>
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-black">
        <div className="pl-6 pt-6">
          <EditProductForm product={product} productIDx={productID} />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
