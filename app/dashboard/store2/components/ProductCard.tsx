import svgPaths from "../imports/svg-evnqkfpdtb";
import { imgImage7 } from "../imports/svg-znvbp";
import { Product, CartItem } from "./App";
import ImageWithFallback from '../../favicon.ico';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <path
              d={svgPaths.p304c0b00}
              fill={i < rating ? "#FFC107" : "#E5E7EB"}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

function EyeIcon() {
  return (
    <div className="relative shrink-0 size-5">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
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
    <div className="relative shrink-0 size-5">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
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
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-muted-foreground/20">
      {/* Product Image */}
      <div className="relative">
        <div className="bg-muted border-b border-border aspect-square relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {/* Brand Badge */}
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md shadow-sm">
          <span className="text-xs font-medium">{product.brand}</span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-md shadow-sm">
          <span className="text-xs font-medium">{product.category}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 space-y-2">
        {/* Title and Description */}
        <div className="space-y-1">
          <h3 className="font-medium text-card-foreground line-clamp-2 leading-snug text-sm">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-card-foreground text-sm">
            {product.price}
          </div>
          <StarRating rating={product.rating} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button 
            onClick={() => onClick?.(product)}
            className="flex-1 bg-background border border-muted rounded-lg px-3 py-2 flex items-center justify-center gap-1.5 hover:bg-accent transition-colors"
          >
            <EyeIcon />
            <span className="font-medium text-foreground text-xs">Details</span>
          </button>
          
          <button 
            onClick={() => onClick?.(product)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-lg px-3 py-2 flex items-center justify-center gap-1.5 transition-colors"
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