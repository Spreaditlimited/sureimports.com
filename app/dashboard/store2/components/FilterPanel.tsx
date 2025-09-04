"use client";

import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-cenuq5ljyw";
import { FilterState, Product, getCategoryData } from "../App";
import { Slider } from "./ui/slider";

function VuesaxOutlineCloseCircle() {
  return (
    <div
      className="absolute contents inset-0"
      data-name="vuesax/outline/close-circle"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="close-circle">
          <path
            d={svgPaths.p261e480}
            fill="currentColor"
            className="text-foreground"
            id="Vector"
          />
          <path
            d={svgPaths.pc509a80}
            fill="currentColor"
            className="text-foreground"
            id="Vector_2"
          />
          <path
            d={svgPaths.p30b5df00}
            fill="currentColor"
            className="text-foreground"
            id="Vector_3"
          />
          <g id="Vector_4" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function VuesaxOutlineCloseCircle1({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="relative shrink-0 size-6 cursor-pointer hover:opacity-70 transition-opacity text-foreground"
      data-name="vuesax/outline/close-circle"
      onClick={onClick}
    >
      <VuesaxOutlineCloseCircle />
    </button>
  );
}

function CategoryButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative rounded-lg shrink-0 transition-colors text-sm ${
        isActive 
          ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200' 
          : 'bg-muted border border-border hover:bg-accent text-foreground'
      }`}
    >
      <span className="font-normal leading-6">{label}</span>
    </button>
  );
}

function BrandButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative rounded-lg shrink-0 transition-colors text-sm ${
        isActive 
          ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200' 
          : 'bg-muted border border-border hover:bg-accent text-foreground'
      }`}
    >
      <span className="font-normal leading-6">{label}</span>
    </button>
  );
}

function ColorButton({ color, label }: { color: string; label: string }) {
  return (
    <button
      disabled
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-3 py-2 relative rounded-lg shrink-0 text-sm bg-muted border border-border text-muted-foreground cursor-not-allowed opacity-50"
    >
      <div className="relative shrink-0 size-4">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 16 16"
        >
          <circle
            cx="8"
            cy="8"
            fill={color}
            r="8"
            opacity="0.5"
          />
        </svg>
      </div>
      <span className="font-normal leading-6">{label}</span>
    </button>
  );
}

interface FilterPanelProps {
  isOpen: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClose: () => void;
  products: Product[];
}

export default function FilterPanel({ isOpen, filters, onFilterChange, onClose, products }: FilterPanelProps) {
  const [localMinPrice, setLocalMinPrice] = useState<string>("");
  const [localMaxPrice, setLocalMaxPrice] = useState<string>("");
  const [sliderValues, setSliderValues] = useState<number[]>([0, 5000000]);

  // Get dynamic store settings
  const getStoreSettings = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('storeSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // If parsing fails, return default
        }
      }
    }
    return {
      categories: {
        'Laptops': ['HP', 'Macbooks', 'ASUS', 'Lenovo', 'Dell', 'Acer'],
        'Phones': ['Apple', 'Samsung', 'Google Pixel', 'Redmi', 'OnePlus', 'Huawei'],
        'Tablets': ['Apple', 'Samsung', 'Microsoft', 'Huawei'],
        'Accessories': ['FAYA', 'Anker', 'Belkin', 'JBL', 'Sony']
      },
      conditions: ['Brand new', 'Pre-owned', 'Refurbished', 'Open box'],
      storage: ['32G', '64G', '128G', '256G', '512G', '1TB', '2TB'],
      memory: ['2G', '4G', '8G', '16G', '32G', '64G'],
      graphicsMemory: ['2G', '4G', '6G', '8G', '12G', '16G', '24G'],
      warranty: ['3 months', '6 months', '12 months', '24 months', '36 months']
    };
  };

  const storeSettings = getStoreSettings();
  
  // Initialize local price values and slider from props
  useEffect(() => {
    setLocalMinPrice(filters.minPrice > 0 ? filters.minPrice.toString() : "");
    setLocalMaxPrice(filters.maxPrice < 5000000 ? filters.maxPrice.toString() : "");
    setSliderValues([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  const toggleCategory = (category: string) => {
    const updatedCategories = filters.selectedCategories.includes(category) 
      ? filters.selectedCategories.filter(c => c !== category)
      : [...filters.selectedCategories, category];
    
    onFilterChange({ selectedCategories: updatedCategories });
  };

  const toggleBrand = (brand: string) => {
    const updatedBrands = filters.selectedBrands.includes(brand) 
      ? filters.selectedBrands.filter(b => b !== brand)
      : [...filters.selectedBrands, brand];
    
    onFilterChange({ selectedBrands: updatedBrands });
  };

  const toggleCondition = (condition: string) => {
    const updatedConditions = filters.selectedConditions.includes(condition) 
      ? filters.selectedConditions.filter(c => c !== condition)
      : [...filters.selectedConditions, condition];
    
    onFilterChange({ selectedConditions: updatedConditions });
  };

  const toggleStorage = (storage: string) => {
    const updatedStorage = filters.selectedStorage.includes(storage) 
      ? filters.selectedStorage.filter(s => s !== storage)
      : [...filters.selectedStorage, storage];
    
    onFilterChange({ selectedStorage: updatedStorage });
  };

  const toggleMemory = (memory: string) => {
    const updatedMemory = filters.selectedMemory.includes(memory) 
      ? filters.selectedMemory.filter(m => m !== memory)
      : [...filters.selectedMemory, memory];
    
    onFilterChange({ selectedMemory: updatedMemory });
  };

  const handleGraphicsCardChange = (value: string) => {
    onFilterChange({ 
      hasGraphicsCard: value,
      selectedGraphicsMemory: value === "No" ? [] : filters.selectedGraphicsMemory
    });
  };

  const toggleGraphicsMemory = (memory: string) => {
    const updatedGraphicsMemory = filters.selectedGraphicsMemory.includes(memory) 
      ? filters.selectedGraphicsMemory.filter(m => m !== memory)
      : [...filters.selectedGraphicsMemory, memory];
    
    onFilterChange({ selectedGraphicsMemory: updatedGraphicsMemory });
  };

  const toggleWarranty = (warranty: string) => {
    const updatedWarranty = filters.selectedWarranty.includes(warranty) 
      ? filters.selectedWarranty.filter(w => w !== warranty)
      : [...filters.selectedWarranty, warranty];
    
    onFilterChange({ selectedWarranty: updatedWarranty });
  };

  const parsePrice = (value: string): number => {
    if (value === "" || value === null || value === undefined) return 0;
    // Remove any non-numeric characters except for digits
    const cleanedValue = value.replace(/[^0-9]/g, '');
    const numValue = parseInt(cleanedValue);
    return isNaN(numValue) ? 0 : numValue;
  };

  const handleMinPriceChange = (value: string) => {
    setLocalMinPrice(value);
    const numValue = parsePrice(value);
    const newSliderValues = [numValue, sliderValues[1]];
    setSliderValues(newSliderValues);
    onFilterChange({ minPrice: numValue });
  };

  const handleMaxPriceChange = (value: string) => {
    setLocalMaxPrice(value);
    const numValue = value === "" ? 5000000 : parsePrice(value);
    const newSliderValues = [sliderValues[0], numValue];
    setSliderValues(newSliderValues);
    onFilterChange({ maxPrice: numValue });
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    setLocalMinPrice(values[0] > 0 ? values[0].toString() : "");
    setLocalMaxPrice(values[1] < 5000000 ? values[1].toString() : "");
    onFilterChange({ 
      minPrice: values[0], 
      maxPrice: values[1] 
    });
  };

  const handleClearFilter = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setSliderValues([0, 5000000]);
    onFilterChange({
      minPrice: 0,
      maxPrice: 5000000,
      selectedCategories: [],
      selectedBrands: [],
      selectedConditions: [],
      selectedStorage: [],
      selectedMemory: [],
      hasGraphicsCard: "",
      selectedGraphicsMemory: [],
      selectedWarranty: []
    });
  };

  const formatCurrency = (value: number): string => {
    return `₦${value.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Filter Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="relative size-full bg-card rounded-tl-3xl rounded-bl-3xl shadow-2xl overflow-hidden border-l border-border">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground">Filter Products</h2>
              <VuesaxOutlineCloseCircle1 onClick={onClose} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Price</h3>
                  
                  {/* Price Input Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-base font-medium text-foreground">Min:</label>
                      <div className="bg-muted rounded-lg border border-border">
                        <input
                          type="number"
                          placeholder="10000"
                          value={localMinPrice}
                          onChange={(e) => handleMinPriceChange(e.target.value)}
                          className="w-full px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none rounded-lg"
                          min="0"
                          max="5000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-base font-medium text-foreground">Max:</label>
                      <div className="bg-muted rounded-lg border border-border">
                        <input
                          type="number"
                          placeholder="5000000"
                          value={localMaxPrice}
                          onChange={(e) => handleMaxPriceChange(e.target.value)}
                          className="w-full px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none rounded-lg"
                          min="0"
                          max="5000000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Price Range Slider */}
                  <div className="pt-4 space-y-4">
                    <div className="px-3">
                      <Slider
                        value={sliderValues}
                        onValueChange={handleSliderChange}
                        max={5000000}
                        min={0}
                        step={10000}
                        className="w-full [&_[data-slot='slider-range']]:bg-blue-500 [&_[data-slot='slider-thumb']]:border-blue-500 [&_[data-slot='slider-thumb']]:bg-card hover:[&_[data-slot='slider-thumb']]:ring-4 hover:[&_[data-slot='slider-thumb']]:ring-blue-500/20 focus-visible:[&_[data-slot='slider-thumb']]:ring-4 focus-visible:[&_[data-slot='slider-thumb']]:ring-blue-500/20"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(sliderValues[0])}</span>
                      <span>{formatCurrency(sliderValues[1])}</span>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Drag the handles to adjust price range
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Categories</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(storeSettings.categories).map((category) => (
                        <CategoryButton 
                          key={category}
                          label={category} 
                          isActive={filters.selectedCategories.includes(category)}
                          onClick={() => toggleCategory(category)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Colors - Disabled */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-muted-foreground">By Colors</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Coming Soon</span>
                  </div>
                  <div className="space-y-3 opacity-50">
                    <div className="flex flex-wrap gap-2">
                      <ColorButton color="#000000" label="Black" />
                      <ColorButton color="#FFC107" label="Yellow" />
                      <ColorButton color="#0C5627" label="Green" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ColorButton color="#F24444" label="Red" />
                      <ColorButton color="#0A01FF" label="Blue" />
                      <ColorButton color="#D81DF5" label="Pink" />
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Condition</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {storeSettings.conditions.map((condition) => (
                        <CategoryButton 
                          key={condition}
                          label={condition} 
                          isActive={filters.selectedConditions.includes(condition)}
                          onClick={() => toggleCondition(condition)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Storage</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {storeSettings.storage.map((storage) => (
                        <CategoryButton 
                          key={storage}
                          label={storage} 
                          isActive={filters.selectedStorage.includes(storage)}
                          onClick={() => toggleStorage(storage)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Memory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Memory</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {storeSettings.memory.map((memory) => (
                        <CategoryButton 
                          key={memory}
                          label={memory} 
                          isActive={filters.selectedMemory.includes(memory)}
                          onClick={() => toggleMemory(memory)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dedicated Graphics Card */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Dedicated Graphics Card</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <CategoryButton 
                        label="Yes" 
                        isActive={filters.hasGraphicsCard === 'Yes'}
                        onClick={() => handleGraphicsCardChange('Yes')}
                      />
                      <CategoryButton 
                        label="No" 
                        isActive={filters.hasGraphicsCard === 'No'}
                        onClick={() => handleGraphicsCardChange('No')}
                      />
                    </div>
                    
                    {/* Graphics Memory - only show if "Yes" is selected */}
                    {filters.hasGraphicsCard === 'Yes' && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-base font-medium text-muted-foreground">Graphics Memory</h4>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {storeSettings.graphicsMemory.map((memory) => (
                              <CategoryButton 
                                key={memory}
                                label={memory} 
                                isActive={filters.selectedGraphicsMemory.includes(memory)}
                                onClick={() => toggleGraphicsMemory(memory)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warranty */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Warranty</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {storeSettings.warranty.map((warranty) => (
                        <CategoryButton 
                          key={warranty}
                          label={warranty} 
                          isActive={filters.selectedWarranty.includes(warranty)}
                          onClick={() => toggleWarranty(warranty)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">By Brands</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        // Get all unique brands from all categories
                        const allBrands = new Set<string>();
                        Object.values(storeSettings.categories).forEach((brands) => {
                          brands.forEach((brand) => allBrands.add(brand));
                        });
                        return Array.from(allBrands).map((brand) => (
                          <BrandButton 
                            key={brand}
                            label={brand} 
                            isActive={filters.selectedBrands.includes(brand)}
                            onClick={() => toggleBrand(brand)}
                          />
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <button
                onClick={handleClearFilter}
                className="w-full bg-indigo-800 hover:bg-indigo-900 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground py-3 px-5 rounded-lg font-medium transition-colors"
              >
                Clear Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}