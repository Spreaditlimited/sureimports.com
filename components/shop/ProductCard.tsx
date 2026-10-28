'use client';

import Link from 'next/link';
import { Check, ShoppingCart } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShopCart } from '@/app/context/ShopCartContext';
import styles from './ProductCard.module.css';
import { productConditionLabel } from '@/lib/shop/discovery';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  priceNGN: number;
  image: string;
  category: string;
  condition?: string | null;
  basePath?: string;
  openCartOnAdd?: boolean;
  minimumQuantity?: number | null;
}

export default function ProductCard({
  id,
  name,
  brand,
  priceNGN,
  image,
  category,
  condition,
  basePath = '/shop',
  openCartOnAdd = true,
  minimumQuantity,
}: ProductCardProps) {
  const { addToCart, isInCart } = useShopCart();
  const inCart = isInCart(id);
  const conditionLabel = condition
    ? productConditionLabel({ productName: name, productCondition: condition })
    : '';
  const title = name.replace(/ — (Refurbished|Brand new)$/i, '');
  return (
    <article className={styles.card}>
      <Link
        href={`${basePath}/${id}`}
        className={styles.visual}
        aria-label={`View ${name}`}
      >
        <ProductImage src={image} alt={name} />
        {conditionLabel && (
          <span className={styles.badge}>{conditionLabel}</span>
        )}
      </Link>
      <div className={styles.body}>
        <p className={styles.brand}>{brand}</p>
        <Link href={`${basePath}/${id}`} className={styles.title}>
          <h3>{title}</h3>
        </Link>
        <div className={styles.purchase}>
          <p className={styles.price}>₦{priceNGN.toLocaleString('en-NG')}</p>
          <p className={styles.delivery}>
            Nigeria doorstep delivery included · 10–15 business days
          </p>
          {minimumQuantity && minimumQuantity > 1 ? (
            <p className={styles.delivery}>
              Minimum quantity: {minimumQuantity}
            </p>
          ) : null}
          <button
            type="button"
            className={styles.action}
            disabled={inCart}
            aria-label={
              inCart ? `${name} is in your cart` : `Add ${name} to cart`
            }
            onClick={() => {
              if (inCart) return;
              addToCart(
                {
                  pidProduct: id,
                  productName: name,
                  productPrice: priceNGN,
                  productImage: image || '/images/default.png',
                  productBrand: brand,
                  productCategory: category,
                },
                Math.max(1, Math.ceil(minimumQuantity || 1)),
              );
              if (openCartOnAdd)
                window.dispatchEvent(new Event('open-shop-cart'));
            }}
          >
            {inCart ? <Check size={17} /> : <ShoppingCart size={17} />}
            {inCart ? 'Added to cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
