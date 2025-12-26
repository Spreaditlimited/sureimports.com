'use client';

import { FilterState } from '../App';
import svgPaths from '../imports/svg-evnqkfpdtb';
import { Button } from './ui/button';

function SearchIcon() {
  return (
    <div className="relative size-6 shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="search-normal">
          <path d={svgPaths.p149a93c0} className="fill-foreground" />
          <path d={svgPaths.p32a96770} className="fill-foreground" />
        </g>
      </svg>
    </div>
  );
}

function FilterIcon() {
  return (
    <div className="relative size-6 shrink-0">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="filter">
          <path d={svgPaths.p28b78e00} className="fill-foreground" />
          <path d={svgPaths.p5802880} className="fill-foreground" />
        </g>
      </svg>
    </div>
  );
}

function CartIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16 5 16H17M17 13V16M9 19.5A1.5 1.5 0 1 1 12 19.5 1.5 1.5 0 0 1 9 19.5ZM20 19.5A1.5 1.5 0 1 1 23 19.5 1.5 1.5 0 0 1 20 19.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrdersIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13H8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 17H8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 9H9H8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SearchFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onShowFilterPanel: () => void;
  onShowCart?: () => void;
  onShowOrders?: () => void;
  cartItemCount?: number;
}

export function SearchFilter({
  filters,
  onFilterChange,
  onShowFilterPanel,
  onShowCart,
  onShowOrders,
  cartItemCount = 0,
}: SearchFilterProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="bg-input-background flex flex-1 items-center gap-3 rounded-lg border border-border px-5 py-3">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Product here..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Clear Search Button */}
        {filters.searchQuery !== '' && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
          >
            Clear Search
          </button>
        )}

        {/* Filter Button */}
        <button
          onClick={onShowFilterPanel}
          className="bg-input-background flex cursor-pointer items-center gap-3 rounded-lg border border-border px-5 py-3 transition-colors hover:bg-accent"
        >
          <FilterIcon />
          <span className="whitespace-nowrap font-medium text-foreground">
            Filter
          </span>
        </button>

        {/* My Cart Button */}
        {onShowCart && (
          <div className="relative">
            <Button
              onClick={onShowCart}
              className="h-auto border-blue-600 bg-blue-600 px-5 py-3 font-medium text-white hover:border-blue-700 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              size="default"
            >
              <CartIcon color="white" />
              My Cart
            </Button>
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 min-w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white shadow-lg">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </div>
        )}

        {/* My Orders Button */}
        {onShowOrders && (
          <Button
            onClick={onShowOrders}
            variant="outline"
            className="h-auto border-border px-5 py-3 font-medium text-foreground hover:border-border hover:bg-accent hover:text-accent-foreground"
            size="default"
          >
            <OrdersIcon color="currentColor" />
            My Orders
          </Button>
        )}
      </div>
    </div>
  );
}
