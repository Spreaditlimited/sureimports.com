'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MoreOrders from '../../view-orders/components/products-table/orders-view-more';
import Loader from '@/components/uix/Loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ProductData {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
}

export default function ViewOrderPage() {
  const router = useRouter();
  const params = useParams<{ pidOrder: string }>();
  const searchParams = useSearchParams();

  const pidOrder = params?.pidOrder || '';
  const returnStatus = searchParams.get('statusx') || 'saved';

  const [products, setProducts] = useState<ProductData[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!pidOrder) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/get-data/procurement-product-data?pidOrder=${pidOrder}`,
          { cache: 'no-store' },
        );

        if (!res.ok) {
          throw new Error('Failed to fetch order products');
        }

        const data = await res.json();
        setProducts(data?.productsGetAll || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load order details');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pidOrder]);

  if (loading) {
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  }

  if (!products) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() =>
          router.push(`/dashboard/procurement/view-orders/${returnStatus}`)
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>

      <MoreOrders products={products} statusOverride={returnStatus} />
    </div>
  );
}
