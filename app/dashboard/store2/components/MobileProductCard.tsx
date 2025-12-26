import svgPaths from '../imports/svg-evnqkfpdtb';
import { imgImage7 } from '../imports/svg-znvbp';
import { Product } from './App';
import ImageWithFallback from '../../favicon.ico';

interface MobileProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

function CartIcon() {
  return (
    <div className="h-4 w-4 flex-shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13C18.1 13 19 13.9 19 15S18.1 17 17 17M7 13C5.9 13 5 13.9 5 15S5.9 17 7 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function MobileProductCard({
  product,
  onClick,
}: MobileProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 p-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
            {product.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill={i < product.rating ? '#fbbf24' : '#e5e7eb'}
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
            className="flex w-full flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2 py-1.5 transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <CartIcon />
            <span className="whitespace-nowrap text-xs font-medium text-white">
              Buy
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
