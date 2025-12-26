'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-96 max-w-[90vw] transform bg-card shadow-2xl transition-transform duration-300 ease-in-out">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-2xl font-semibold text-foreground dark:text-white">
              Filter Products
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground dark:text-white">
                  Category
                </label>
                <Select value={localCategory} onValueChange={setLocalCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground dark:text-white">
                  Brand
                </label>
                <Select value={localBrand} onValueChange={setLocalBrand}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground dark:text-white">
                  Price Range
                </label>
                <div className="space-y-4">
                  <Slider
                    min={priceRange.min}
                    max={priceRange.max}
                    step={1000}
                    value={localPriceRange}
                    onValueChange={setLocalPriceRange}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
                    <span>₦{localPriceRange[0].toLocaleString()}</span>
                    <span>₦{localPriceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-border p-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="flex-1 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
