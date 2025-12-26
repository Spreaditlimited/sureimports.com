import svgPaths from '../imports/svg-evnqkfpdtb';
import { imgImage7 } from '../imports/svg-znvbp';
import { Product, CartItem } from './App';
import ImageWithFallback from '../../favicon.ico';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-4">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 18 18"
          >
            <path
              d={svgPaths.p304c0b00}
              fill={i < rating ? '#FFC107' : '#E5E7EB'}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function EyeIcon() {
  return (
    <div className="relative size-5 shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="eye">
          <path d={svgPaths.p128d6f80} className="fill-foreground" />
          <path d={svgPaths.p190981c0} className="fill-foreground" />
        </g>
      </svg>
    </div>
  );
}

function CartIcon() {
  return (
    <div className="relative size-5 shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="shopping-cart">
          <path d={svgPaths.p3c066000} fill="white" />
          <path d={svgPaths.pff6570} fill="white" />
          <path d={svgPaths.p3e164800} fill="white" />
          <path d={svgPaths.p1faa6100} fill="white" />
        </g>
      </svg>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-muted-foreground/20 hover:shadow-md">
      {/* Product Image */}
      <div className="relative">
        <div className="relative aspect-square overflow-hidden border-b border-border bg-muted">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* Brand Badge */}
        <div className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-primary-foreground shadow-sm">
          <span className="text-xs font-medium">{product.brand}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute right-2 top-2 rounded-md bg-indigo-600 px-2 py-1 text-white shadow-sm">
          <span className="text-xs font-medium">{product.category}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2 p-3">
        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground">
            {product.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-card-foreground">
            {product.price}
          </div>
          <StarRating rating={product.rating} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onClick?.(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-muted bg-background px-3 py-2 transition-colors hover:bg-accent"
          >
            <EyeIcon />
            <span className="text-xs font-medium text-foreground">Details</span>
          </button>

          <button
            onClick={() => onClick?.(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 transition-colors hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
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
