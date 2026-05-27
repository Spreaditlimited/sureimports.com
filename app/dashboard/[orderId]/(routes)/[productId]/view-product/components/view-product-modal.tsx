'use client';

import React from 'react';
import AddProductForm from './view-product-form';
import { useParams } from 'next/navigation';
import SavedOrders from '@/content/general-procurement/saved-orders.json';

function AddProductModal() {
  const param = useParams();
  const productId = parseInt(
    (Array.isArray(param.productId) ? param.productId[0] : param.productId) ??
      '0',
  );
  const orderId = parseInt(
    (Array.isArray(param.orderId) ? param.orderId[0] : param.orderId) ?? '0',
  );

  // Find the order with the matching orderId
  const order = SavedOrders.Orders.find((order) => order.id === orderId);

  // Find the product within the order with the matching productId
  const product = order
    ? order.Product.find((product) => product.id === productId)
    : null;

  let productData = null;
  if (product) {
    productData = {
      id: product.id,
      name: product.name,
      info: product.info,
      quantity: product.quantity,
      price: product.unitPrice,
      weight: product.unitWeight,
      total: product.quantity * product.unitPrice,
    };
  }

  return (
    <div>
      <div className="border-b py-5 pl-6 text-xl font-bold text-slate-800 dark:text-slate-300">
        Product{'  '} {`${param.productId}`}
      </div>
      <div className="pl-6 pt-6">
        {productData ? (
          <AddProductForm product={productData} />
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
}

export default AddProductModal;
