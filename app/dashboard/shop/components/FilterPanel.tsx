'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  X, 
  SlidersHorizontal, 
  Layers, 
  Tag, 
  Banknote 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  selectedCategory: string;
  selectedBrand: string;
  minPrice: number;
  maxPrice: number;
  onFilterChange: (filters: any) => void;
}

export default function FilterPanel({
  isOpen,
  onClose,
  categories,
  brands,
  priceRange,
  selectedCategory,
  selectedBrand,
  minPrice,
  maxPrice,
  onFilterChange,
}: FilterPanelProps) {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localBrand, setLocalBrand] = useState(selectedBrand);
  const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setLocalCategory(selectedCategory);
    setLocalBrand(selectedBrand);
    setLocalPriceRange([minPrice, maxPrice]);
  }, [selectedCategory, selectedBrand, minPrice, maxPrice]);

  const handleApplyFilters = () => {
    onFilterChange({
      category: localCategory,
      brand: localBrand,
      minPrice: localPriceRange[0],
      maxPrice: localPriceRange[1],
    });
    onClose();
  };

  const handleResetFilters = () => {
    setLocalCategory('all');
    setLocalBrand('all');
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFilterChange({
      category: 'all',
      brand: 'all',
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[400px] max-w-[90vw] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <div className="space-y-8">
            
            {/* Category Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Layers className="h-3 w-3" />
                Category
              </label>
              <Select value={localCategory} onValueChange={setLocalCategory}>
                <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                  <SelectItem value="all" className="text-sm font-medium">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-sm font-medium">
                      {category.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Tag className="h-3 w-3" />
                Brand
              </label>
              <Select value={localBrand} onValueChange={setLocalBrand}>
                <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-slate-50 px-4 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                  <SelectItem value="all" className="text-sm font-medium">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand} className="text-sm font-medium">
                      {brand.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Price Range Filter */}
            <div className="space-y-6">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Banknote className="h-3 w-3" />
                Price Range
              </label>
              
              <div className="px-2">
                <Slider
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1000}
                  value={localPriceRange}
                  onValueChange={setLocalPriceRange}
                  className="w-full"
                />
              </div>

              {/* Price Display Boxes */}
              <div className="flex items-center gap-4">
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Min Price</span>
                  <span className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                    ₦{localPriceRange[0].toLocaleString()}
                  </span>
                </div>
                <div className="h-[2px] w-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Max Price</span>
                  <span className="mt-1 text-sm font-black text-slate-900 dark:text-white">
                    ₦{localPriceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1 rounded-xl border-slate-200 bg-white py-6 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 rounded-xl bg-blue-600 py-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-transform hover:bg-blue-500 active:scale-[0.98]"
            >
              Apply Filters
            </Button>
          </div>
        </div>
        
      </div>
    </>
  );
}