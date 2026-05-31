'use client';

import React, { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import { 
  User, 
  Phone, 
  Mail, 
  QrCode, 
  MessageCircle, 
  FileText, 
  Banknote,
  Info,
  Building,
  UploadCloud,
  Send
} from 'lucide-react';

import { useAuth } from '@/app/context/AuthContext';
import { useModal } from '@/app/context/ModalContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';

// API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: any;
}

export default function ShippingOnlyForm() {
  const productID = 'PS' + new Date().getTime().toString();

  const navigateWithAlert = useNavigationWithAlert();
  const { user } = useAuth();
  const { isModalOpen, openModal, closeModal } = useModal();
  
  const [pidUser] = useState(user?.pidUser || '');
  const [pidPaySupplier] = useState(productID);

  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [aliPayAccountQRCodeImage, setAliPayAccountQRCodeImage] = useState<File | null>(null);
  const [weChatAccountQRCodeImage, setWeChatAccountQRCodeImage] = useState<File | null>(null);
  const [proformaInvoiceImage, setProformaInvoiceImage] = useState<File | null>(null);
  const [supplierBankAccountDetails, setSupplierBankAccountDetails] = useState('');
  
  const [amountToPayInYuan, setAmountToPayInYuan] = useState<number | string>('');
  const [amountToPayInNaira, setAmountToPayInNaira] = useState<number | string>('');
  const [serviceCharge] = useState(0);

  const exchangeRate = 237.87;

  const handleAmountToPayInYuan = (e: ChangeEvent<HTMLInputElement>) => {
    const amountYuan = parseFloat(e.target.value);
    setAmountToPayInYuan(e.target.value);
    if (!isNaN(amountYuan)) {
      setAmountToPayInNaira(parseFloat((amountYuan * exchangeRate).toFixed(2)));
    } else {
      setAmountToPayInNaira('');
    }
  };

  const handleAmountToPayInNaira = (e: ChangeEvent<HTMLInputElement>) => {
    const amountNaira = parseFloat(e.target.value);
    setAmountToPayInNaira(e.target.value);
    if (!isNaN(amountNaira)) {
      setAmountToPayInYuan(parseFloat((amountNaira / exchangeRate).toFixed(2)));
    } else {
      setAmountToPayInYuan('');
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pidUser', pidUser);
    formData.append('userEmail', user?.userEmail || '');
    formData.append('pidPaySupplier', pidPaySupplier);
    formData.append('supplierName', supplierName);
    formData.append('supplierPhone', supplierPhone);
    formData.append('supplierEmail', supplierEmail);
    if (aliPayAccountQRCodeImage) formData.append('aliPayAccountQRCodeImage', aliPayAccountQRCodeImage);
    if (weChatAccountQRCodeImage) formData.append('weChatAccountQRCodeImage', weChatAccountQRCodeImage);
    if (proformaInvoiceImage) formData.append('proformaInvoiceImage', proformaInvoiceImage);
    formData.append('supplierBankAccountDetails', supplierBankAccountDetails);
    formData.append('amountToPayInYuan', String(amountToPayInYuan || 0));
    formData.append('amountToPayInNaira', String(amountToPayInNaira || 0));
    formData.append('serviceCharge', String(serviceCharge));

    try {
      toast.info('Processing request...');
      
      const res = await fetch('/api/crud/pay-supplier-create', {
        method: 'POST',
        body: formData,
      });

      const data: ApiResponse = await res.json();

      if (data.responsex.status === 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/shipping-only/request-received',
          'success',
          'We have received your request!'
        );
      } else if (data.responsex.status === 'ALIPAY_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      } else if (data.responsex.status === 'WECHAT_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      } else if (data.responsex.status === 'PROFORMA_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      } else if (data.responsex.status === 'EMPTY_DETAILS') {
        toast.warning(data.responsex.message);
      } else if (data.responsex.status === 'INVALID_IMAGE_UPLOAD' || data.responsex.status === 'IMAGE_UPLOAD_FAILED' || data.responsex.status === 'IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      } else {
        toast.error(data.responsex.message || 'Action failed. Please try again.');
      }
    } catch (error: any) {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#161629]">
      <div className="border-b border-slate-100 p-6 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Supplier & Payment Details</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Even if you want us to source more than one product, kindly provide the details of just one product.
        </p>
      </div>

      <form onSubmit={submitForm} className="p-6 space-y-8">
        
        {/* Contact Info Section */}
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <User className="h-3.5 w-3.5" /> Supplier Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Supplier Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Guangzhou Tech Co."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Supplier Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="Provide Supplier's Phone"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Supplier Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  placeholder="Provide Supplier's Email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Uploads Section */}
        <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <UploadCloud className="h-3.5 w-3.5" /> Documentation & QR Codes
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 dark:bg-[#0f1020]">
              <QrCode className="mx-auto mb-2 h-6 w-6 text-slate-400" />
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">AliPay QR Code (Optional)</p>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setAliPayAccountQRCodeImage(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
              />
            </div>
            
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center dark:border-slate-700 dark:bg-[#0f1020]">
              <MessageCircle className="mx-auto mb-2 h-6 w-6 text-slate-400" />
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">WeChat QR Code (Optional)</p>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setWeChatAccountQRCodeImage(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
              />
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center sm:col-span-2 dark:border-slate-700 dark:bg-[#0f1020]">
              <FileText className="mx-auto mb-2 h-6 w-6 text-slate-400" />
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Proforma Invoice</p>
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={(e) => setProformaInvoiceImage(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                required
              />
            </div>
          </div>
        </section>

        {/* Banking & Amounts */}
        <section className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <Building className="h-3.5 w-3.5" /> Financial Details
          </h3>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Supplier's Bank Account Details (Optional)</label>
            <textarea
              value={supplierBankAccountDetails}
              onChange={(e) => setSupplierBankAccountDetails(e.target.value)}
              placeholder="e.g. Account Name, Account Number, Bank Name, Branch..."
              className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Amount to Pay (¥ Yuan / RMB)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">¥</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountToPayInYuan}
                  onChange={handleAmountToPayInYuan}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Equivalent Amount (₦ Naira)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountToPayInNaira}
                  onChange={handleAmountToPayInNaira}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-[#0f1020] dark:text-white dark:placeholder:text-slate-600"
                  required
                />
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 ml-1 flex items-center gap-1">
                <Info className="h-3 w-3" /> Exchange rate: ¥1 = ₦{exchangeRate}
              </p>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            type="submit" 
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 active:scale-95 dark:shadow-blue-900/40"
          >
            <Banknote className="h-4 w-4" /> Request Bank Deposit
          </button>
        </div>
      </form>
    </div>
  );
}