'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { BiWorld } from 'react-icons/bi';
import { ImOffice } from 'react-icons/im';
import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';

// Define an interface for the props
interface ProductsProps {
  //products: {
  serialNumber: number;
  id: number;
  pidUser: string;
  pidVerifySupplier: string;
  supplierName: string;
  supplierPhone: string;
  supplierAddress: string;
  supplierProduct: string;
  supplierWebsite: string;
  supplierDetails: string;
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
  pidVerifySupplier,
  supplierName,
  supplierPhone,
  supplierAddress,
  supplierProduct,
  supplierWebsite,
  supplierDetails,
  status,
  createdAt,
}) => {
  const url = `product-description/${pidVerifySupplier}`;

  //const [loading, setLoading] = useState(false);
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

  //initialize alert system
  const [userEmail, setEmail] = useState(user?.userEmail);
  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (currency == 'default') {
      setIsCurrencySelected(true);
      setAmount(400000);
    }
    if (currency == 'NGN') {
      setAmount(400000);
    }
    if (currency == 'USD') {
      setAmount(250);
    }
  }, [currency]);

  //FORM DATA SUBMISSION
  const submitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCurrency(event.target.value);
    setIsCurrencySelected(false);
  };

  useEffect(() => {
    if (currency == 'default') {
      setIsCurrencySelected(true);
      setAmount(400000);
    }
    if (currency == 'NGN') {
      setAmount(400000);
    }
    if (currency == 'USD') {
      setAmount(250);
    }
  }, [currency]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('JESUS IS REX');
    setLoading(true);

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    //formData.append('file', file);
    formData.append('pidUser', pidUser);
    formData.append('userEmail', userEmail);
    formData.append('pidVerifySupplier', pidVerifySupplier);
    formData.append('supplierName', supplierName);
    formData.append('supplierPhone', supplierPhone);
    formData.append('supplierAddress', supplierAddress);
    formData.append('supplierProduct', supplierProduct);
    formData.append('supplierWebsite', supplierWebsite);
    formData.append('supplierDetails', supplierDetails);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Proceed to make payment');
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

  const handleDelete = async () => {
    //console.log('deleted');

    try {
      setIsOpen({ isOpen: false });
      toast.info('Processing . . .');
      const res = await fetch(
        `/api/crud/verify-supplier-delete/${pidUserx}/${pidVerifySupplier}`,
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
          '/dashboard/verify-supplier/pending-payment',
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
      <div className="pl-4 pr-4 dark:bg-black">
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
                      Request Id: <b>{pidVerifySupplier}</b>
                      <span className="text-slate-600">
                        {' '}
                        (Supplier: <b>{supplierName}</b>, Phone :{supplierPhone}
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

            <AccordionContent className="hide-scrollbar rounded-2xl bg-white dark:bg-[#161629]">
              {/*.................................. FORM BLOCK STARTS.................................... */}
              <RadFormLayout title="" subtitle="">
                <form onSubmit={submitForm}>
                  <div className="flex flex-col p-2 md:flex-row">
                    <div className="md:w-1/1 w-full">
                      <label className="block text-[16px] font-medium text-gray-700">
                        Details of Supplier
                      </label>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: PRODUCT NAME */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Supplier Name'}
                          reacticon={<ImOffice />}
                          name={'supplierName'}
                          id={'supplierName'}
                          value={supplierName}
                          //onChange={(e) => setSupplierName(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          placeholder={'Enter Supplier Name'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: Whats App Number */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Supplier Phone Contact'}
                          reacticon={<IoLogoWhatsapp />}
                          name={'supplierPhone'}
                          id={'supplierPhone'}
                          value={supplierPhone}
                          //onChange={(e) => setSupplierPhone(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          placeholder={
                            '  Enter your supplier contact phone number'
                          }
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ONE COLUMN: BANK NAME & ACCOUNT NUMBER */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadTextArea
                          label={'Supplier Address'}
                          name="supplierAddress"
                          id="supplierAddress"
                          value={supplierAddress}
                          //onChange={(e) => setSupplierAddress(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          //defaultValue={''}
                          placeholder="Provide the suppliers address"
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: PRODUCT NAME */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Supplier Product'}
                          reacticon={<FaBox />}
                          name={'supplierProduct'}
                          id={'supplierProduct'}
                          value={supplierProduct}
                          //onChange={(e) => setSupplierProduct(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          placeholder={'Enter Supplier Products'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SINGLE COLUMN: PRODUCT NAME */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadText
                          label={'Suppliers Website Address'}
                          reacticon={<BiWorld />}
                          name={'supplierWebsite'}
                          id={'supplierWebsite'}
                          value={supplierWebsite}
                          //onChange={(e) => setSupplierWebsite(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          placeholder={'Enter Suppliers website address'}
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ONE COLUMN: BANK NAME & ACCOUNT NUMBER */}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/1 w-full p-2">
                      {/* COL 2 */}
                      <div>
                        <RadTextArea
                          label={'More Details'}
                          name="supplierDetails"
                          id="supplierDetails"
                          value={supplierDetails}
                          //onChange={(e) => setSupplierDetails(e.target.value)}
                          onChange={() => {
                            null;
                          }}
                          //defaultValue={''}
                          placeholder="Provide additional details about the supplier."
                          disable={true}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {/* <Dialog
                      open={isOpen.isOpen}
                      onOpenChange={handleOpenChange}
                    >

                      <DialogTrigger asChild>
                          <Button variant="link" type="button">
                            view terms and conditions
                          </Button>
                      </DialogTrigger>

                      <DialogContent className="flex h-[60vh] flex-col overflow-hidden p-0 dark:bg-[#161629] max-md:h-[90vh] lg:max-w-[800px]">
                        <DialogHeader className="sticky top-0 bg-white px-6 py-4 dark:bg-[#161629]">
                          <DialogTitle>Read Our Terms</DialogTitle>
                        </DialogHeader>
                        <div className="dark flex flex-grow flex-col gap-5 overflow-y-auto px-6 py-4 text-sm">
                          <div>
                            In buying from China, MOQ (Minimum Order Quantity)
                            is extremely important.
                          </div>
                          <div>
                            Unit prices drop when quantity increases. Someone
                            importing a 40 ft container of an item will sell
                            cheaper than you if you wish to import a smaller
                            quantity.
                          </div>
                          <div>
                            Also, you must consider if the product you wish to
                            import is already ubiquitous in your local market.
                            If it is, please, consider buying from your local
                            market as we may not be able to get you a better
                            price.
                          </div>
                          <div className="font-medium">
                            We are here to serve you if:
                          </div>
                          <div className="flex flex-col gap-2">
                            <div>
                              1. you are not satisfied with the quality of the
                              product in your local market and want to get the
                              best.
                            </div>
                            <div>
                              2. the products you wish to import are scarce or
                              unavailable in your local market.
                            </div>
                            <div>
                              3. you wish to import a large quantity of a
                              product so as to compete favorably in your local
                              market.
                            </div>
                          </div>
                          <div>
                            The product sourcing commitment fee you{"'"}ll pay
                            will only be refunded when you go ahead to place an
                            order based on the best quote we give you.
                          </div>
                        </div>
                        <DialogFooter className="sticky bottom-0 flex justify-between bg-white px-6 py-4 dark:bg-[#161629]">
                          <div className="flex w-full justify-between">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id="terms"
                                checked={isAgreed}
                                onCheckedChange={(checked) =>
                                  setIsAgreed(checked === true)
                                }
                              />
                              <label htmlFor="terms">
                                I have read and agree with your terms
                              </label>
                            </div>
                            <Button type="submit" onClick={handleDelete}>
                              Proceed to Pay & Submit
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog> */}

                    {status != 'pending-payment' ? (
                      <h1>** Request has been placed **</h1>
                    ) : (
                      <>
                        <div>
                          <RadButtonIcon
                            label={'Pay | via Flutterwave'}
                            onClick={openModal}
                          />

                          <Modal isOpen={isModalOpen} onClose={closeModal}>
                            <h2 className="text-blue-950">
                              Proceed to make payment
                            </h2>
                            <p className="text-blue-950">
                              <b>Amount to pay is $250 or N400,000</b>
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
                              serviceID={pidVerifySupplier}
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
                                service_id={pidVerifySupplier}
                                service_name={'PROCUREMENT'}
                                description={'This is General Procuremnt & Shipping Service'}
                                isDisabled={isDisabled}
                                className={isDisabled
                                  ? 'flex items-center gap-2 rounded-2xl bg-indigo-800 pb-2 pl-5 pr-5 pt-2 hover:bg-indigo-700'
                                  : 'flex items-center gap-2 rounded-2xl bg-slate-400 pb-2 pl-5 pr-5 pt-2 hover:bg-slate-500'} destinationCountry={''}                            />
                            {/* *********************************************************************************************************** */}
                          </Modal>
                        </div>
                      </>
                    )}
                  </div>
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
