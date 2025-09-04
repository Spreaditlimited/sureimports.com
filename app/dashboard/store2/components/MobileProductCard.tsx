import svgPaths from "../imports/svg-evnqkfpdtb";
import { imgImage7 } from "../imports/svg-znvbp";
import { Product } from "./App";
import ImageWithFallback from '../../favicon.ico';

interface MobileProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

function CartIcon() {
  return (
    <div className="w-4 h-4 flex-shrink-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13C18.1 13 19 13.9 19 15S18.1 17 17 17M7 13C5.9 13 5 13.9 5 15S5.9 17 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function MobileProductCard({
  product,
  onClick
}: MobileProductCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="aspect-square bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 text-foreground">
            {product.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                  <path 
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                    fill={i < product.rating ? "#fbbf24" : "#e5e7eb"} 
                    stroke="none"
                  />
                </svg>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {product.condition}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-semibold text-foreground">
            {product.price}
          </div>
          <button 
            onClick={() => onClick?.(product)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg px-2 py-1.5 flex items-center justify-center gap-1.5 transition-colors w-full"
          >
            <CartIcon />
            <span className="font-medium text-white text-xs whitespace-nowrap">
              Buy
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}