'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import BankDepositForm from './deposite-form';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import RadTextArea from '@/components/uix/xForm/RadTextArea';
import { FaBox, FaMoneyBill } from 'react-icons/fa';
import RadNumber from '@/components/uix/xForm/RadNumber';
import { FaBoxesStacked, FaMoneyBillTransfer } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io';
import RadText from '@/components/uix/xForm/RadText';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import { useModal } from '@/app/context/ModalContext';
import Modal from '@/components/uix/Modal';
import RadSelectCurrency from '@/components/uix/xForm/RadSelectCurrency';
import Paystack from '@/components/uix/Paystack';
import { CurrencyDollarIcon } from '@heroicons/react/16/solid';
import RadButton from '@/components/uix/xForm/RadButtonIcon';
import RadButtonIcon from '@/components/uix/xForm/RadButtonIcon';
import { RiBankFill } from 'react-icons/ri';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { FaAlipay } from 'react-icons/fa';
import { AiFillWechat } from 'react-icons/ai';
import { FaFileInvoice } from 'react-icons/fa6';
import { MdCurrencyYuan, MdEmail } from 'react-icons/md';
import { TbCurrencyNaira } from 'react-icons/tb';
import RadImage from '@/components/uix/xForm/RadImage';
import Link from 'next/link';
import router, { useParams, useRouter, useSearchParams } from 'next/navigation';

// Define an interface for the props
interface ProductsProps {
  serialNumber: number;
  id: number;
  pidPaySupplier: string;
  pidUser: string;
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  aliPayAccountQRCodeImage: string;
  weChatAccountQRCodeImage: string;
  proformaInvoiceImage: string;
  supplierBankAccountDetails: string;
  amountToPayInYuan: string;
  amountToPayInNaira: string;
  serviceCharge: string;
  status: string;
  createdAt: string;
}

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
}

//API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: User;
}

// Use the interface to annotate the props of the component
//const OrderCard: React.FC<ProductsProps> = ({ products }) => {
const OrderCard: React.FC<ProductsProps> = ({
  serialNumber,
  id,
  pidPaySupplier,
  pidUser,
  supplierName,
  supplierPhone,
  supplierEmail,
  aliPayAccountQRCodeImage,
  weChatAccountQRCodeImage,
  proformaInvoiceImage,
  supplierBankAccountDetails,
  amountToPayInYuan,
  amountToPayInNaira,
  serviceCharge,
  status,
  createdAt,
}) => {
  const url = `product-description/${pidPaySupplier}`;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isCurrencySelected, setIsCurrencySelected] = useState<true | false>(
    true,
  );

  const searchParams = useSearchParams();
  // const status = searchParams.get('statusx');
  const [param1, setParam1] = useState(
    searchParams.get('statusx') || '',
  ) as any;
  //get url from www.example.com/products/param1 (Where App Route is "App/products/[id]/page.tsx")
  const params = useParams<{ statusx: string }>(); //id is from [id]
  const statusx = params.statusx;

  const [amount, setAmount] = useState<number>(35000);
  const [currency, setCurrency] = useState<string>('default');
  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  //const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUserx, setPidUser] = useState(user?.pidUser);
  const { isModalOpen, openModal, closeModal } = useModal();

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrency(event.target.value);
    setIsCurrencySelected(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = async () => {
    //console.log('deleted');

    try {
      setIsOpen({ isOpen: false });
      toast.info('Processing . . .');
      const res = await fetch(
        `/api/crud/pay-supplier-delete/${pidUserx}/${pidPaySupplier}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        navigateWithAlert(
          '/dashboard/pay-supplier/saved',
          'success',
          'Request has been deleted!',
        );
      }
      // if (data.responsex.status == 'SUCCESS') {
      //   toast.success(data.responsex.message);
      // }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }
  };

  const onKeep = () => {
    console.log('kept');
    setIsOpen({ isOpen: false });
  };

  return (
    <>
      <div className="pl-4 pr-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-white px-5 py-5 transition-all duration-200 dark:bg-[#161629] sm:flex-row xl:h-[100px] xl:items-center">
              <div>
                <div className="flex flex-row gap-4">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-center text-4xl font-bold capitalize text-slate-300 dark:bg-slate-800 dark:text-white">
                    {serialNumber}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-xl font-bold capitalize text-slate-800 dark:text-slate-200">
                      {supplierName}
                    </div>
                    <div className="text-base font-normal text-slate-950 dark:text-slate-100">
                      Order Id: <b>{pidPaySupplier}</b>
                      <span className="text-slate-600">
                        {' '}
                        (Email: <b>{supplierEmail}</b>, Phone:{' '}
                        <b>{supplierPhone}</b>)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 max-sm:w-full md:flex-row">
                <div className="flex gap-3">
                  <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <Button className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-red-100 p-0 font-normal hover:bg-red-200">
                        <Image
                          src="/icons/delete.svg"
                          alt="delete"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="flex max-w-[396px] flex-col items-center justify-center overflow-auto rounded-[20px] py-[30px] dark:bg-[#161629]">
                      <Image
                        src="/icons/deletewarning.svg"
                        alt="delete"
                        width={100}
                        height={100}
                        className="cursor-pointer"
                      />
                      <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-white">
                        Are you sure you want to delete?
                      </div>
                      <div className="flex w-80 text-center text-sm text-slate-600">
                        This will delete this record and you cannot recover it.
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={onKeep}
                          className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]"
                        >
                          No! keep it
                        </Button>
                        <Button
                          onClick={handleDelete}
                          className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                        >
                          {' '}
                          Yes! Remove
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AccordionTrigger className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-slate-100 p-0 text-slate-600 hover:bg-black/10"></AccordionTrigger>
                </div>
              </div>
            </div>

            <AccordionContent className="hide-scrollbar rounded-2xl bg-white dark:bg-[#161629]">
              {/* <BankDepositForm /> */}

              {/*.................................. FORM BLOCK STARTS.................................... */}
              <RadFormLayout title="" subtitle="">
                <form>
                  <div className="flex flex-col p-2 md:flex-row">
                    <div className="md:w-1/1 w-full">
                      <label className="block text-[16px] font-medium text-gray-600">
                        <b> Details of your request below;</b>
                        <br />
                      </label>
                    </div>
                  </div>

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
                          //onChange={(e) => setSupplierName(e.target.value)}
                          onChange={(e) => null}
                          placeholder={'Provide Suppliers Name'}
                          disable={true}
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
                          //onChange={(e) => setSupplierPhone(e.target.value)}
                          onChange={(e) => null}
                          placeholder={'Provide Suppliers Phone Number'}
                          disable={true}
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
                          //onChange={(e) => setSupplierEmail(e.target.value)}
                          onChange={(e) => null}
                          placeholder={'Provide Suppliers Email'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    {/* ALIPAY IMAGE */}
                    {aliPayAccountQRCodeImage && (
                      <div className="w-full p-2 md:w-1/3">
                        <label>Supplier`s AliPay Account Details Image</label>
                        <Image
                          src={
                            (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL) +
                            '/' +
                            aliPayAccountQRCodeImage
                          }
                          alt={'AliPayImage'}
                          height={300}
                          width={300}
                          className="rounded-md"
                        />
                      </div>
                    )}

                    {/* WECHAT IMAGE */}
                    {weChatAccountQRCodeImage && (
                      <div className="w-full p-2 md:w-1/3">
                        <label>Supplier`s WeChat Account Details Image</label>
                        <Image
                          src={
                            (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL) +
                            '/' +
                            weChatAccountQRCodeImage
                          }
                          alt={'AliPayImage'}
                          height={300}
                          width={300}
                          className="rounded-md"
                        />
                      </div>
                    )}

                    {/* PROFORMA IMAGE */}
                    {proformaInvoiceImage && (
                      <div className="w-full p-2 md:w-1/3">
                        <label>Proforma Invoice Image</label>
                        <Image
                          src={
                            (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL) +
                            '/' +
                            proformaInvoiceImage
                          }
                          alt={'Proforma Invoice'}
                          height={300}
                          width={300}
                          className="rounded-md"
                        />
                      </div>
                    )}
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
                          onChange={() => {
                            null;
                          }}
                          //defaultValue={''}
                          placeholder="Provide your supplier bank account details"
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Amount to Pay (¥ Yuan) (RMB) */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Amount to Pay (¥ Yuan) (RMB)'}
                          reacticon={<MdCurrencyYuan />}
                          name={'amountToPayInYuan'}
                          id={'amountToPayInYuan'}
                          value={amountToPayInYuan}
                          onChange={() => {
                            null;
                          }}
                          placeholder={'Enter Amount in Yuan'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Equivalent Amount in (₦ Naira) */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Equivalent Amount in (₦ Naira)'}
                          reacticon={<TbCurrencyNaira />}
                          name={'amountToPayInNaira'}
                          id={'amountToPayInNaira'}
                          value={amountToPayInNaira}
                          onChange={() => {
                            null;
                          }}
                          placeholder={'Enter Amount in Naira'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {statusx == 'saved' && (
                    <>
                      {/* ///////////////////// SUBMIT BUTTON ///////////////////// */}
                      <div className="flex justify-end">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/1 w-full p-2">
                            <Button
                              type="button"
                              className={
                                'flex items-center gap-2 rounded-2xl bg-blue-800 pb-2 pl-5 pr-5 pt-2 hover:bg-blue-600'
                              }
                              onClick={() => {
                                router.push(
                                  '/dashboard/bank-payment/?service=pay-supplier&amount=' +
                                    amountToPayInNaira +
                                    '&currencyType=NGN&destinationCountry=NONE&serviceID=' +
                                    pidPaySupplier +
                                    '&serviceDescription=Pay for General Procurement Service',
                                );
                              }}
                            >
                              <Image
                                loading="lazy"
                                src="/icons/bank.svg"
                                alt="Logo"
                                width={20}
                                height={20}
                                className="items-center self-center"
                              />
                              Bank Deposit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </RadFormLayout>

              {/*.................................. FORM BLOCK ENDS .................................... */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default OrderCard;
function setCurrency(value: string) {
  throw new Error('Function not implemented.');
}
