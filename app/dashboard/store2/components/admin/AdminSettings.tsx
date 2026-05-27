// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  Package,
  DollarSign,
  Wrench,
  FileText,
} from 'lucide-react';
import { StoreSettings, SettingsManager } from './SettingsManager';

interface AdminSettingsProps {
  settings: StoreSettings;
  settingsManager: SettingsManager;
}

export function AdminSettings({
  settings,
  settingsManager,
}: AdminSettingsProps) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('categories');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState<{
    category: string;
    brand: string;
  } | null>(null);
  const [editingListField, setEditingListField] = useState<{
    field: string;
    value: string;
    index: number;
  } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newListFieldValue, setNewListFieldValue] = useState('');

  const handleAddCategory = () => {
    if (settingsManager.addCategory(newCategoryName)) {
      setNewCategoryName('');
    }
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    settingsManager.editCategory(oldName, newName);
    setEditingCategory(null);
  };

  const handleAddBrand = (category: string) => {
    if (settingsManager.addBrand(category, newBrandName)) {
      setNewBrandName('');
    }
  };

  const handleEditBrand = (
    category: string,
    oldBrand: string,
    newBrand: string,
  ) => {
    settingsManager.editBrand(category, oldBrand, newBrand);
    setEditingBrand(null);
  };

  const handleAddListFieldValue = (field: string) => {
    if (
      settingsManager.addListFieldValue(
        field as keyof StoreSettings,
        newListFieldValue,
      )
    ) {
      setNewListFieldValue('');
    }
  };

  const handleEditListFieldValue = (
    field: string,
    oldValue: string,
    newValue: string,
  ) => {
    settingsManager.editListFieldValue(
      field as keyof StoreSettings,
      oldValue,
      newValue,
    );
    setEditingListField(null);
  };

  const renderListFieldSection = (
    field: string,
    title: string,
    description: string,
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            value={newListFieldValue}
            onChange={(e) => setNewListFieldValue(e.target.value)}
            placeholder={`Add new ${title.toLowerCase()}`}
            onKeyPress={(e) =>
              e.key === 'Enter' && handleAddListFieldValue(field)
            }
          />
          <Button onClick={() => handleAddListFieldValue(field)}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {settings[field]?.map((value: string, index: number) => (
            <div
              key={value}
              className="flex items-center justify-between rounded border p-2"
            >
              {editingListField?.field === field &&
              editingListField?.value === value ? (
                <Input
                  defaultValue={value}
                  onBlur={(e) =>
                    handleEditListFieldValue(field, value, e.target.value)
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditListFieldValue(
                        field,
                        value,
                        e.currentTarget.value,
                      );
                    }
                  }}
                  className="text-sm"
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-sm">{value}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingListField({ field, value, index })
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {title}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{value}"? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              settingsManager.deleteListFieldValue(
                                field as keyof StoreSettings,
                                value,
                              )
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Store Settings</h2>
          <p className="text-muted-foreground">
            Manage your store configuration, product categories, pricing
            formulas, and system settings.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" />
          Auto-saved
        </Button>
      </div>

      <Tabs
        value={activeSettingsTab}
        onValueChange={setActiveSettingsTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="categories">Categories & Brands</TabsTrigger>
          <TabsTrigger value="attributes">Product Attributes</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Commission</TabsTrigger>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>

        {/* Categories & Brands Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Categories & Brands
              </CardTitle>
              <CardDescription>
                Manage product categories and their associated brands. Each
                category has its own pricing formula.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add new category */}
              <div className="mb-6 flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Add new category"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>

              {/* Categories list */}
              <div className="space-y-4">
                {Object.entries(settings.categories).map(
                  ([category, brands]) => (
                    <Card key={category} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          {editingCategory === category ? (
                            <Input
                              defaultValue={category}
                              onBlur={(e) =>
                                handleEditCategory(category, e.target.value)
                              }
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditCategory(
                                    category,
                                    e.currentTarget.value,
                                  );
                                }
                              }}
                              className="text-lg font-medium"
                              autoFocus
                            />
                          ) : (
                            <h3 className="flex items-center gap-2 text-lg font-medium">
                              {category}
                              <Badge variant="secondary">
                                {brands.length} brands
                              </Badge>
                            </h3>
                          )}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Category
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the "
                                    {category}" category? This will also remove
                                    all associated brands and pricing formulas.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      settingsManager.deleteCategory(category)
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Add new brand */}
                        <div className="mb-3 flex gap-2">
                          <Input
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder={`Add brand to ${category}`}
                            onKeyPress={(e) =>
                              e.key === 'Enter' && handleAddBrand(category)
                            }
                          />
                          <Button
                            onClick={() => handleAddBrand(category)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Brands list */}
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                          {brands.map((brand) => (
                            <div
                              key={brand}
                              className="flex items-center justify-between rounded border p-2"
                            >
                              {editingBrand?.category === category &&
                              editingBrand?.brand === brand ? (
                                <Input
                                  defaultValue={brand}
                                  onBlur={(e) =>
                                    handleEditBrand(
                                      category,
                                      brand,
                                      e.target.value,
                                    )
                                  }
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditBrand(
                                        category,
                                        brand,
                                        e.currentTarget.value,
                                      );
                                    }
                                  }}
                                  className="text-sm"
                                  autoFocus
                                />
                              ) : (
                                <>
                                  <span className="text-sm">{brand}</span>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        setEditingBrand({ category, brand })
                                      }
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="ghost">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Delete Brand
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "
                                            {brand}" from {category}? This
                                            action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              settingsManager.deleteBrand(
                                                category,
                                                brand,
                                              )
                                            }
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Attributes Tab */}
        <TabsContent value="attributes" className="space-y-6">
          {renderListFieldSection(
            'conditions',
            'Product Conditions',
            'Manage available product condition options',
          )}
          {renderListFieldSection(
            'storage',
            'Storage Options',
            'Manage available storage capacity options',
          )}
          {renderListFieldSection(
            'memory',
            'Memory/RAM Options',
            'Manage available memory/RAM options',
          )}
          {renderListFieldSection(
            'graphicsMemory',
            'Graphics Memory Options',
            'Manage available graphics memory options',
          )}
          {renderListFieldSection(
            'warranty',
            'Warranty Options',
            'Manage available warranty period options',
          )}
        </TabsContent>

        {/* Pricing & Commission Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Formulas & Commissions
              </CardTitle>
              <CardDescription>
                Configure pricing calculations and affiliate commissions for
                each product category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(settings.pricingFormulas).map(
                  ([category, formula]) => (
                    <Card key={category} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <CardDescription>
                          Configure pricing formula for {category.toLowerCase()}{' '}
                          products
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <Label className="text-sm">Addition (RMB)</Label>
                            <Input
                              type="number"
                              value={formula.addition}
                              onChange={(e) =>
                                settingsManager.updatePricingFormula(
                                  category,
                                  'addition',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Amount added to supplier price
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Multiplier</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formula.multiplier}
                              onChange={(e) =>
                                settingsManager.updatePricingFormula(
                                  category,
                                  'multiplier',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Exchange rate multiplier
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Commission (₦)</Label>
                            <Input
                              type="number"
                              value={formula.commission}
                              onChange={(e) =>
                                settingsManager.updatePricingFormula(
                                  category,
                                  'commission',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Affiliate commission per sale
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg bg-muted p-3">
                          <h4 className="mb-2 text-sm font-medium">
                            Pricing Formula:
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            (Supplier Price + {formula.addition}) ×{' '}
                            {formula.multiplier} = Store Price
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Example: (1000 + {formula.addition}) ×{' '}
                            {formula.multiplier} = ₦
                            {(
                              (1000 + formula.addition) *
                              formula.multiplier
                            ).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                General Store Settings
              </CardTitle>
              <CardDescription>
                Configure basic store information and operational settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={settings.storeName}
                    onChange={(e) =>
                      settingsManager.updateGeneralSetting(
                        'storeName',
                        e.target.value,
                      )
                    }
                    placeholder="Your store name"
                  />
                </div>
                <div>
                  <Label>Delivery Time (days)</Label>
                  <Input
                    type="number"
                    value={settings.deliveryTime}
                    onChange={(e) =>
                      settingsManager.updateGeneralSetting(
                        'deliveryTime',
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <Label>Store Description</Label>
                <Textarea
                  value={settings.storeDescription}
                  onChange={(e) =>
                    settingsManager.updateGeneralSetting(
                      'storeDescription',
                      e.target.value,
                    )
                  }
                  placeholder="Describe your store..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management
              </CardTitle>
              <CardDescription>
                Manage default text content and messaging across your store.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Default Pay Small Small Text</Label>
                <Textarea
                  value={settings.paySmallSmallDefault}
                  onChange={(e) =>
                    settingsManager.updateGeneralSetting(
                      'paySmallSmallDefault',
                      e.target.value,
                    )
                  }
                  placeholder="Default Pay Small Small description..."
                  rows={6}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  This text will be used as the default Pay Small Small
                  description for new products.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
