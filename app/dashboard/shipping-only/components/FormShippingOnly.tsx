'use client';

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Currency, Loader2, Phone, User } from 'lucide-react';

import ImageBox from '@/components/uix/ImageBox';
import ImageBoxLarge from '@/components/uix/ImageBoxLarge';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import { MdEmail } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import RadButtonIcon from '@/components/uix/xForm/RadButtonIcon';
import RadTextArea from '@/components/uix/xForm/RadTextArea';
import RadText from '@/components/uix/xForm/RadText';
import { FaCalendarAlt, FaPhone } from 'react-icons/fa';
import RadSelectGender from '@/components/uix/xForm/RadSelectGender';
import { PiGenderIntersex } from 'react-icons/pi';
import countries from '@/lib/data/countries';
import RadSelectOption from '@/components/uix/xForm/RadSelectOption';
import { BiWorld } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import RadDateSelector from '@/components/uix/xForm/RadDateSelector';
import { FaBox } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';
import RadNumber from '@/components/uix/xForm/RadNumber';
import { FaBoxesStacked } from 'react-icons/fa6';
import { FaMoneyBill } from 'react-icons/fa';
import Paystack from '@/components/uix/Paystack';
import { useModal } from '@/app/context/ModalContext';
import Modal from '@/components/uix/Modal';
import RadSelectCurrency from '@/components/uix/xForm/RadSelectCurrency';
import {
  CurrencyDollarIcon,
  PhoneArrowDownLeftIcon,
  PhoneIcon,
} from '@heroicons/react/16/solid';
import { RiBankFill } from 'react-icons/ri';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaAlipay } from 'react-icons/fa';
import { AiFillWechat } from 'react-icons/ai';
import { FaFileInvoice } from 'react-icons/fa6';
import { MdCurrencyYuan } from 'react-icons/md';
import { TbCurrencyNaira } from 'react-icons/tb';
import RadImage from '@/components/uix/xForm/RadImage';

interface FormProps {}

interface userData {
  address: unknown;
  id: number;
  pidUser: string;
  userEmail: string;
  userFirstname: string;
  gender: string;
  dob: Date | undefined;
  phone: string;
  country: string;
  userImage: string;
}

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
  userImage: string;
  userStatus: string;
}

//API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: User;
}

function ShippingOnlyForm() {
  let productID = 'PS' + new Date().getTime().toString();

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const { isModalOpen, openModal, closeModal } = useModal();
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidPaySupplier, setPidSpecialSourcing] = useState(productID);
  const [email, setEmail] = useState(user?.userEmail);

  const [supplierName, setSupplierName] = React.useState('');
  const [supplierPhone, setSupplierPhone] = React.useState('');
  const [supplierEmail, setSupplierEmail] = React.useState('');
  const [aliPayAccountQRCodeImage, setAliPayAccountQRCodeImage] =
    useState<File | null>(null);
  const [weChatAccountQRCodeImage, setWeChatAccountQRCodeImage] =
    useState<File | null>(null);
  const [proformaInvoiceImage, setProformaInvoiceImage] = useState<File | null>(
    null,
  );
  const [supplierBankAccountDetails, setSupplierBankAccountDetails] =
    React.useState('');
  const [amountToPayInYuan, setAmountToPayInYuan] = React.useState<number>(0);
  const [amountToPayInNaira, setAmountToPayInNaira] = React.useState<number>(0);
  const [serviceCharge, setServiceCharge] = React.useState(0);

  const handleAmountToPayInYuan = (e: ChangeEvent<HTMLInputElement>) => {
    let amountYuan = e.target.value;
    setAmountToPayInYuan(parseFloat(amountYuan));
    // Update another field based on the new changes in yuan value here
    setAmountToPayInNaira(parseFloat(amountYuan) * 237.87);
  };

  const handleAmountToPayInNaira = (e: ChangeEvent<HTMLInputElement>) => {
    let amountNaira = e.target.value;
    setAmountToPayInNaira(parseFloat(amountNaira));
    // Update another field based on the new changes in yuan value here
    setAmountToPayInYuan(parseFloat(amountNaira) / 237.87);
  };

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //console.log(file);
    //setLoading(true);

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;

    formData.append('pidUser', pidUser);
    formData.append('userEmail', user?.userEmail);
    formData.append('pidPaySupplier', pidPaySupplier);
    formData.append('supplierName', supplierName);
    formData.append('supplierPhone', supplierPhone);
    formData.append('supplierEmail', supplierEmail);
    formData.append('aliPayAccountQRCodeImage', aliPayAccountQRCodeImage);
    formData.append('weChatAccountQRCodeImage', weChatAccountQRCodeImage);
    formData.append('proformaInvoiceImage', proformaInvoiceImage);
    formData.append('supplierBankAccountDetails', supplierBankAccountDetails);
    formData.append('amountToPayInYuan', amountToPayInYuan);
    formData.append('amountToPayInNaira', amountToPayInNaira);
    formData.append('serviceCharge', serviceCharge);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');
      //MAKE REQUEST
      const res = await fetch('/api/crud/pay-supplier-create', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/shipping-only/request-received',
          'success',
          'We have received your request!',
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   openModal();
      //   toast.success(data.responsex.message);
      // }
      if (data.responsex.status == 'ALIPAY_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'WECHAT_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'PROFORMA_IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'EMPTY_DETAILS') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'INVALID_IMAGE_UPLOAD') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'IMAGE_NOT_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'IMAGE_UPLOAD_FAILED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'ACTION_FAILED') {
        toast.error(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

  return (
    <>
      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="" subtitle="">
        <form onSubmit={submitForm}>
          <div className="flex flex-col p-2 md:flex-row">
            <div className="md:w-1/1 w-full">
              <label className="block text-[16px] font-medium text-slate-400">
                Even if you want us to source more than one product, kindly
                provide the details of just one product.
              </label>
            </div>
          </div>

          {/* <div className="flex w-full items-center justify-center">
            <div className="dark:hover:bg-bray-800 flex h-72 w-full cursor-pointer flex-col justify-center rounded-[10px] border border-dashed border-indigo-800 bg-indigo-800/10">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <ImageBoxLarge
                  onImageChange={handleImageChange}
                  imagex={file}
                />
              </div>
            </div>
          </div> */}

          {/* TWO COLUMN: SUPPLIER NAME & PHONE*/}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Supplier Name'}
                  reacticon={<FaUser />}
                  name={'supplierName'}
                  id={'supplierName'}
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder={'Provide Suppliers Name'}
                  disable={false}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Supplier Phone'}
                  reacticon={<FaPhoneAlt />}
                  name={'supplierPhone'}
                  id={'supplierPhone'}
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder={'Provide Suppliers Phone Number'}
                  disable={false}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: SUPPLIER EMAIL & ALIPAY ACCOUNT */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Email'}
                  reacticon={<MdEmail />}
                  name={'spplierEmail'}
                  id={'spplierEmail'}
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  placeholder={'Provide Suppliers Email'}
                  disable={false}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadImage
                  label="Supplier`s AliPay Account Details (Optional)"
                  name={'aliPayAccountQRCodeImage'}
                  id={'aliPayAccountQRCodeImage'}
                  reacticon={<FaAlipay />}
                  className="h-[60px] rounded-md border-slate-700 bg-slate-100 pl-7 text-gray-500 max-sm:w-[340px] lg:w-full"
                  onChange={setAliPayAccountQRCodeImage}
                  maxSizeMB={2}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: SUPPLIER WECHAT AND PROFORMA INVOICE */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadImage
                  label="Supplier`s WeChat Account Details (Optional)"
                  reacticon={<AiFillWechat />}
                  name={'weChatAccountQRCodeImage'}
                  id={'weChatAccountQRCodeImage'}
                  className="h-[60px] rounded-md border-slate-50 bg-slate-100 pl-7 text-gray-500 max-sm:w-[340px] lg:w-full"
                  onChange={setWeChatAccountQRCodeImage}
                  maxSizeMB={2}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadImage
                  label="Proforma Invoice"
                  reacticon={<FaFileInvoice />}
                  name={'proformaInvoiceImage'}
                  id={'proformaInvoiceImage'}
                  className="h-[60px] rounded-md border-slate-50 bg-slate-100 pl-7 text-gray-500 max-sm:w-[340px] lg:w-full"
                  onChange={setProformaInvoiceImage}
                  maxSizeMB={2}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: Supplier`s Bank Account Details (Optional) */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadTextArea
                  label={'Supplier`s Bank Account Details (Optional)'}
                  name="supplierBankAccountDetails"
                  id="supplierBankAccountDetails"
                  value={supplierBankAccountDetails}
                  onChange={(e) =>
                    setSupplierBankAccountDetails(e.target.value)
                  }
                  defaultValue={''}
                  placeholder="Provide your supplier bank account details"
                />
              </div>
            </div>
          </div>

          {/* SINGLE COLUMN: Amount to Pay (¥ Yuan) (RMB) */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadNumber
                  label={'Amount to Pay (¥ Yuan) (RMB)'}
                  reacticon={<MdCurrencyYuan />}
                  name={'amountToPayInYuan'}
                  id={'amountToPayInYuan'}
                  value={amountToPayInYuan as any}
                  onChange={handleAmountToPayInYuan}
                  placeholder={'Enter Amount in Yuan'}
                  disable={false}
                />
              </div>
            </div>
          </div>

          {/* SINGLE COLUMN: Equivalent Amount in (₦ Naira) */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadNumber
                  label={'Equivalent Amount in (₦ Naira)'}
                  reacticon={<TbCurrencyNaira />}
                  name={'amountToPayInNaira'}
                  id={'amountToPayInNaira'}
                  value={amountToPayInNaira as any}
                  onChange={handleAmountToPayInNaira}
                  placeholder={'Enter Amount in Naira'}
                  disable={false}
                />
              </div>
            </div>
          </div>

          {/* ///////////////////// SUBMIT BUTTON ///////////////////// */}
          <div className="flex justify-end">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <RadButtonIcon
                  label="Bank Deposit"
                  reacticon={<RiBankFill />}
                  value={'formaction'}
                />
              </div>
            </div>
          </div>
        </form>
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
}

export default ShippingOnlyForm;
