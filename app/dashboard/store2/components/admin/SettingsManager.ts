export interface StoreSettings {
  categories: Record<string, string[]>;
  conditions: string[];
  storage: string[];
  memory: string[];
  graphicsMemory: string[];
  warranty: string[];
  pricingFormulas: Record<string, {
    addition: number;
    multiplier: number;
    commission: number;
  }>;
  deliveryTime: number;
  currency: string;
  storeName: string;
  storeDescription: string;
  paySmallSmallDefault: string;
}

export const defaultStoreSettings: StoreSettings = {
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
  warranty: ['3 months', '6 months', '12 months', '24 months', '36 months'],
  pricingFormulas: {
    'Phones': { addition: 500, multiplier: 225, commission: 20000 },
    'Tablets': { addition: 500, multiplier: 225, commission: 20000 },
    'Laptops': { addition: 750, multiplier: 225, commission: 20000 },
    'Accessories': { addition: 0, multiplier: 225, commission: 1000 }
  },
  deliveryTime: 10,
  currency: 'NGN',
  storeName: 'Buy Gadgets from China',
  storeDescription: 'Get genuine brand new or pre-owned gadgets shipped from China in just 10 business days. Every phone comes boxed with accessories, a full warranty, and extras like screen protectors and cases plus friendly after-sales support you can count on. Quality gadgets, delivered hassle-free.',
  paySmallSmallDefault: 'Own this item without the financial strain! Spread your payments anyhow you want and enjoy smooth, flexible financing. No credit or debit card required. No fixed payment amount. We will create a dedicated account for you and you transfer money to the account as many times as you want. When you complete payment, we ship from China to you. Our estimated delivery timeline is 10 business days to our Lagos office.'
};

export const getStoreSettings = (): StoreSettings => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('storeSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // If parsing fails, return default settings
      }
    }
  }
  return defaultStoreSettings;
};

export const saveStoreSettings = (settings: StoreSettings): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('storeSettings', JSON.stringify(settings));
  }
};

export class SettingsManager {
  private settings: StoreSettings;
  private onChange: (settings: StoreSettings) => void;

  constructor(initialSettings: StoreSettings, onChange: (settings: StoreSettings) => void) {
    this.settings = initialSettings;
    this.onChange = onChange;
  }

  private updateSettings(newSettings: StoreSettings): void {
    this.settings = newSettings;
    saveStoreSettings(newSettings);
    this.onChange(newSettings);
  }

  // Category management
  addCategory(categoryName: string): boolean {
    const trimmedName = categoryName.trim();
    if (!trimmedName || this.settings.categories[trimmedName]) {
      return false;
    }

    const newSettings = {
      ...this.settings,
      categories: {
        ...this.settings.categories,
        [trimmedName]: []
      },
      pricingFormulas: {
        ...this.settings.pricingFormulas,
        [trimmedName]: { addition: 500, multiplier: 225, commission: 20000 }
      }
    };

    this.updateSettings(newSettings);
    return true;
  }

  deleteCategory(categoryName: string): void {
    const { [categoryName]: deleted, ...remainingCategories } = this.settings.categories;
    const { [categoryName]: deletedFormula, ...remainingFormulas } = this.settings.pricingFormulas;
    
    const newSettings = {
      ...this.settings,
      categories: remainingCategories,
      pricingFormulas: remainingFormulas
    };

    this.updateSettings(newSettings);
  }

  editCategory(oldName: string, newName: string): boolean {
    const trimmedNewName = newName.trim();
    if (!trimmedNewName || trimmedNewName === oldName || this.settings.categories[trimmedNewName]) {
      return false;
    }

    const categoryBrands = this.settings.categories[oldName];
    const categoryFormula = this.settings.pricingFormulas[oldName];
    
    const { [oldName]: deleted, ...otherCategories } = this.settings.categories;
    const { [oldName]: deletedFormula, ...otherFormulas } = this.settings.pricingFormulas;
    
    const newSettings = {
      ...this.settings,
      categories: {
        ...otherCategories,
        [trimmedNewName]: categoryBrands
      },
      pricingFormulas: {
        ...otherFormulas,
        [trimmedNewName]: categoryFormula
      }
    };

    this.updateSettings(newSettings);
    return true;
  }

  // Brand management
  addBrand(category: string, brandName: string): boolean {
    const trimmedName = brandName.trim();
    if (!trimmedName || this.settings.categories[category].includes(trimmedName)) {
      return false;
    }

    const newSettings = {
      ...this.settings,
      categories: {
        ...this.settings.categories,
        [category]: [...this.settings.categories[category], trimmedName]
      }
    };

    this.updateSettings(newSettings);
    return true;
  }

  deleteBrand(category: string, brand: string): void {
    const newSettings = {
      ...this.settings,
      categories: {
        ...this.settings.categories,
        [category]: this.settings.categories[category].filter(b => b !== brand)
      }
    };

    this.updateSettings(newSettings);
  }

  editBrand(category: string, oldBrand: string, newBrand: string): boolean {
    const trimmedNewBrand = newBrand.trim();
    if (!trimmedNewBrand || trimmedNewBrand === oldBrand || this.settings.categories[category].includes(trimmedNewBrand)) {
      return false;
    }

    const newSettings = {
      ...this.settings,
      categories: {
        ...this.settings.categories,
        [category]: this.settings.categories[category].map(b => b === oldBrand ? trimmedNewBrand : b)
      }
    };

    this.updateSettings(newSettings);
    return true;
  }

  // List field management
  addListFieldValue(field: keyof StoreSettings, value: string): boolean {
    const trimmedValue = value.trim();
    const currentList = this.settings[field] as string[];
    
    if (!trimmedValue || currentList.includes(trimmedValue)) {
      return false;
    }

    const newSettings = {
      ...this.settings,
      [field]: [...currentList, trimmedValue]
    };

    this.updateSettings(newSettings);
    return true;
  }

  deleteListFieldValue(field: keyof StoreSettings, value: string): void {
    const currentList = this.settings[field] as string[];
    const newSettings = {
      ...this.settings,
      [field]: currentList.filter(v => v !== value)
    };

    this.updateSettings(newSettings);
  }

  editListFieldValue(field: keyof StoreSettings, oldValue: string, newValue: string): boolean {
    const trimmedNewValue = newValue.trim();
    const currentList = this.settings[field] as string[];
    
    if (!trimmedNewValue || trimmedNewValue === oldValue || currentList.includes(trimmedNewValue)) {
      return false;
    }

    const newSettings = {
      ...this.settings,
      [field]: currentList.map(v => v === oldValue ? trimmedNewValue : v)
    };

    this.updateSettings(newSettings);
    return true;
  }

  // Pricing formula management
  updatePricingFormula(category: string, field: string, value: number): void {
    const newSettings = {
      ...this.settings,
      pricingFormulas: {
        ...this.settings.pricingFormulas,
        [category]: {
          ...this.settings.pricingFormulas[category],
          [field]: value
        }
      }
    };

    this.updateSettings(newSettings);
  }

  // General settings management
  updateGeneralSetting(field: keyof StoreSettings, value: any): void {
    const newSettings = {
      ...this.settings,
      [field]: value
    };

    this.updateSettings(newSettings);
  }
}