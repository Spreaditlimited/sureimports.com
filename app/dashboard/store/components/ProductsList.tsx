import React from 'react';
import ProductCard from './product-card';
//import { StoreItems } from './storedetails';
import { useRouter } from 'next/navigation';

function ProductList({ products }: any) {
  const router = useRouter();

  const handleViewDetails = (pidProduct: string) => {
    router.push('/dashboard/store/details?id=' + pidProduct);
    //alert(pidProduct);
    //console.log(`View details for product ${pidProduct}`);
  };

  const handleAddToCart = (pidProduct: string) => {
    router.push('/dashboard/store/details?id=' + pidProduct);
    //console.log(`Add product ${pidProduct} to cart`);
  };

  return (
    <>
      <div className="align-center max-xl:grid-col-3 bg-backgroundx bg-slate-200x dark:bg-backgroundx dark:bg-slate-700x dark:text-whitex grid min-h-screen gap-5 rounded-xl p-2 text-slate-800 md:grid-cols-3 lg:pl-0 xl:ml-0 xl:mr-0 xl:grid-cols-4 2xl:grid-cols-4">
        {/* <div className="align-center max-xl:grid-col-3 grid gap-5 bg-slate-50 text-slate-800 dark:bg-gray-900 dark:text-white md:grid-cols-3 lg:pl-0 xl:ml-0 xl:mr-0 xl:grid-cols-4 2xl:grid-cols-5"> */}
        {products.map((product: any) => (
          <div className="mx-auto w-full max-w-md p-5">
            <ProductCard
              id={product.id}
              pidProduct={product.pidProduct}
              name={product.productName}
              description={product.productDescription}
              price={product.productPrice}
              image={
                (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                  '/' +
                  `${product.productImage}`) as string
              }
              category={product.productBrand.toUpperCase()}
              rating={5}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;
