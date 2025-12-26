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
import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';

// Define an interface for the props
interface ProductsProps {
  //products: {
  serialNumber: number;
  id: number;
  pidUser: string;
  pidSpecialSourcing: string;
  productName: string;
  whatsappNumber: string;
  productQualityRatings: string;
  targetUnitPrice: string;
  productDescription: string;
  productImage: string;
  status: string;
  createdAt: string;
  //}
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
  pidUser,
  pidSpecialSourcing,
  productName,
  whatsappNumber,
  productQualityRatings,
  targetUnitPrice,
  productDescription,
  productImage,
  status,
  createdAt,
}) => {
  const url = `product-description/${pidSpecialSourcing}`;

  //ENABLE & DISABLE VARIABLES
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isCurrencySelected, setIsCurrencySelected] = useState<true | false>(
    true,
  );
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

  useEffect(() => {
    if (currency == 'default') {
      setIsCurrencySelected(true);
      setAmount(35000);
    }
    if (currency == 'NGN') {
      setAmount(35000);
    }
    if (currency == 'USD') {
      setAmount(20);
    }
  }, [currency]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = async () => {
    //console.log('deleted');

    try {
      setIsOpen({ isOpen: false });
      toast.info('Processing . . .');
      const res = await fetch(
        `/api/crud/special-sourcing-delete/${pidUserx}/${pidSpecialSourcing}`,
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
          '/dashboard/special-sourcing/pending',
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

  ////////////////////////// FLUTTERWAVE PAYMENT //////////////////////////
  const config = {
    public_key: 'FLWPUBK-7ecbd7ff5bae8311218f66d77e0e6cae-X',
    tx_ref: Date.now(),
    amount: amount,
    currency: currency,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.userEmail,
      phone_number: '07064407000',
      name: user?.userFirstname,
    },
    customizations: {
      title: 'OrderID:' + pidSpecialSourcing,
      description: 'Payment for Special Sourcing Order',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  } as any;

  ////////////////////////// FLUTTERWAVE PAYMENT //////////////////////////

  return (
    <>
      <div className="pl-4 pr-4 dark:bg-black">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1 dark:bg-black">
            <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-white px-5 py-5 transition-all duration-200 dark:bg-[#161629] sm:flex-row xl:h-[100px] xl:items-center">
              <div>
                <div className="flex flex-row gap-4">
                  <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-center text-4xl font-bold capitalize text-slate-300 dark:bg-slate-800 dark:text-white">
                    {serialNumber}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="text-xl font-bold capitalize text-slate-800 dark:text-slate-200">
                      {productName}
                    </div>
                    <div className="text-base font-normal text-slate-950 dark:text-slate-100">
                      Order Id: <b>{pidSpecialSourcing}</b>
                      <span className="text-slate-600">
                        {' '}
                        (Qty: <b>{productQualityRatings}</b>, Price :{' '}
                        <b>
                          {/* ₦
                          {(
                            parseFloat(productQualityRatings) *
                            parseFloat(targetUnitPrice)
                          ) */}
                          ¥
                          {
                            //parseFloat(productQualityRatings) *
                            parseFloat(targetUnitPrice)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                        </b>{' '}
                        )
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

            <AccordionContent className="hide-scrollbar rounded-2xl bg-white dark:bg-black">
              {/* <BankDepositForm /> */}
              {/*.................................. FORM BLOCK STARTS.................................... */}
              <RadFormLayout
                title={status.toUpperCase() + ' Product'}
                subtitle=""
              >
                {/* <form onSubmit={submitForm}> */}
                <form>
                  <div className="flex flex-col p-2 md:flex-row">
                    <div className="md:w-1/1 w-full">
                      <label className="block text-[16px] font-medium text-gray-700">
                        Product Details
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

                  <div className="w-full p-2 md:w-1/3">
                    {/* <label>Product Image</label> */}
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                        '/' +
                        productImage
                      }
                      alt={'Product Image'}
                      height={300}
                      width={300}
                      className="rounded-md"
                    />
                  </div>

                  {/* SINGLE COLUMN: PRODUCT NAME */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={''}
                          reacticon={<FaBox />}
                          name={'productName'}
                          id={'productName'}
                          value={productName}
                          onChange={(e) => null}
                          placeholder={'Enter Product Name'}
                          disable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Whats App Number */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadNumber
                          label={''}
                          reacticon={<IoLogoWhatsapp />}
                          name={'whatsappNumber'}
                          id={'whatsappNumber'}
                          value={whatsappNumber}
                          // onChange={(e) => setWhatsappNumber(e.target.value)}
                          onChange={(e) => null}
                          placeholder={whatsappNumber}
                          disable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Whats App Number */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadNumber
                          label={''}
                          reacticon={<FaBoxesStacked />}
                          name={'productQualityRatings'}
                          id={'productQualityRatings'}
                          value={productQualityRatings}
                          // onChange={(e) => setProductQualityRatings(e.target.value)}
                          onChange={(e) => null}
                          placeholder={productQualityRatings}
                          disable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Whats App Number */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadNumber
                          label={''}
                          reacticon={<FaMoneyBill />}
                          name={'targetUnitPrice'}
                          id={'targetUnitPrice'}
                          value={targetUnitPrice}
                          // onChange={(e) => setTargetUnitPrice(e.target.value)}
                          onChange={(e) => null}
                          placeholder={targetUnitPrice}
                          disable={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadTextArea
                          label={''}
                          name="productDescription"
                          id="productDescription"
                          value={productDescription}
                          // onChange={(e) => setProductDescription(e.target.value)}
                          onChange={(e) => null}
                          //defaultValue={''}
                          placeholder={productDescription}
                        />
                      </div>
                    </div>
                  </div>
                </form>

                {/* ................. MODAL A ................. */}
                {/* <div>
          <h1>Home Page</h1>
          <button onClick={openModal}>Open Modal</button>
          
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2>Programmatically Triggered Popup</h2>
            <p>This is a modal that can be triggered programmatically.</p>
          </Modal> */}

                {/* import { useModal } from '@/app/context/ModalContext'; */}
                {/* import Modal from '@/components/uix/Modal'; */}
                {/* const [isModalOpen, setIsModalOpen] = useState(false); */}
                {/* const openModal = () => {setIsModalOpen(true);}; */}
                {/* const closeModal = () => {setIsModalOpen(false);}; */}
                {/* </div> */}
                {/* ................. MODAL A ................. */}

                {/* ................. MODAL B ................. */}

                <div>
                  <RadButtonIcon
                    label={'Pay | Flutterwave'}
                    onClick={openModal}
                  />
                  <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <h2 className="text-blue-950">Proceed to make payment</h2>
                    <p className="text-blue-950">
                      <b>Amount to pay is $20 or N35,000</b>
                    </p>
                    <hr />
                    <br />
                    <RadSelectCurrency
                      label={'- Select Currency -'}
                      reacticon={<FaMoneyBillTransfer />}
                      name={'currency'}
                      id={'currency'}
                      value={currency}
                      onChange={handleCurrencyChange}
                    />

                    {/* <Paystack
                      titlex=" Pay | via Paystack "
                      emailx={user?.email as string}
                      amountx={amount}
                      currency={currency}
                      disabled={isCurrencySelected}
                      serviceID={pidSpecialSourcing}
                    /> */}

                    {/* *********************************************************************************************************** */}
                    <FlutterwavePaymentButton
                      amount={amount}
                      email={user?.userEmail as string}
                      name={user?.userFirstname as string}
                      phone_number={''}
                      currency={currency}
                      payment_type={'CARD'}
                      consumer_id={user?.pidUser as string}
                      service_id={pidSpecialSourcing}
                      service_name={'SPECIAL SOURCING'}
                      description={
                        'This is General Procuremnt & Shipping Service'
                      }
                      isDisabled={isDisabled}
                      className={
                        isDisabled
                          ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                          : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'
                      }
                      destinationCountry={''}
                    />
                    {/* *********************************************************************************************************** */}
                  </Modal>
                </div>

                {/* import { useModal } from '@/app/context/ModalContext'; */}
                {/* import Modal from '@/components/uix/Modal'; */}
                {/* const { isModalOpen, openModal, closeModal } = useModal(); */}
                {/* ................. MODAL B ................. */}
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
