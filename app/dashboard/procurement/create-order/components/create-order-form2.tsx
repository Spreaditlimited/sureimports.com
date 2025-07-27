'use client';

import { X, User, Globe, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function CreateOrderForm() {
  return (
    <div className="flex h-full w-full items-start justify-center bg-slate-950 p-4">
      <div className="w-full rounded-lg bg-[#1a1f2e] p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            Create New Order
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="orderName" className="text-white">
              Order Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="orderName"
                placeholder="Give your order a Name"
                className="w-full border-0 bg-[#262b38] pl-10 text-gray-300 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-white">
              country
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400" />
              <Select>
                <SelectTrigger
                  id="country"
                  className="w-full border-0 bg-[#262b38] pl-10 text-gray-300"
                >
                  <SelectValue placeholder="Destination country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-white">
              currency
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 z-10 h-5 w-5 text-gray-400" />
              <Select>
                <SelectTrigger
                  id="currency"
                  className="w-full border-0 bg-[#262b38] pl-10 text-gray-300"
                >
                  <SelectValue placeholder="Shop currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingPlan" className="text-white">
              Shipping Plan
            </Label>
            <Select>
              <SelectTrigger
                id="shippingPlan"
                className="w-full border-0 bg-[#262b38] text-gray-300"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Shipping</SelectItem>
                <SelectItem value="express">Express Shipping</SelectItem>
                <SelectItem value="overnight">Overnight Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="productCategory" className="text-white">
              Product Category
            </Label>
            <Select>
              <SelectTrigger
                id="productCategory"
                className="w-full border-0 bg-[#262b38] text-gray-300"
              >
                <SelectValue placeholder="Select a Product Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shippingAddress" className="text-white">
              Shipping Address
            </Label>
            <Textarea
              id="shippingAddress"
              placeholder="Enter shipping address here"
              className="min-h-[100px] w-full border-0 bg-[#262b38] text-gray-300 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
