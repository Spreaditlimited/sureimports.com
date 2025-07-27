'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import { Currency, Loader2, User2 } from 'lucide-react';

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
import { CurrencyDollarIcon } from '@heroicons/react/16/solid';
import { ImOffice } from 'react-icons/im';
import FlutterwavePaymentButton from '@/components/FlutterwavePaymentButton';

const formSchema = z.object({
  productImage: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: 'picture must be less than 7MB.',
  }),
  productName: z
    .string()
    .min(2, {
      message: 'Description is required',
    })
    .max(500),
  whatsappNumber: z
    .string()
    .min(10, { message: 'WhatsApp Number must not be empty' })
    .regex(/^\d+$/, { message: 'WhatsApp Number must be a number' }),
  productQualityRatings: z
    .string()
    .min(10, 'Product Quantity must not be empty'),
  targetProductQuantity: z
    .string()
    .min(10, 'Product Quantity must not be empty'),
  targetUnitPrice: z.string().min(10, 'Target unit price must not be empty'),
  description: z.string().min(10, 'Description must not be empty'),
});

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
function SpecialSourcingForm() {
  let productID = 'VS' + new Date().getTime().toString();

  //const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const { isModalOpen, openModal, closeModal } = useModal();
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidVerifySupplier, setPidpidVerifySupplier] = useState(productID);
  const [userEmail, setEmail] = useState(user?.userEmail);
  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [supplierName, setSupplierName] = useState<string>('');
  const [supplierPhone, setSupplierPhone] = useState<string>('');
  const [supplierAddress, setSupplierAddress] = useState<string>('');
  const [supplierProduct, setSupplierProduct] = useState<string>('');
  const [supplierWebsite, setSupplierWebsite] = useState<string>('');
  const [supplierDetails, setSupplierDetails] = useState<string>('');

  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCurrencySelected, setIsCurrencySelected] = useState<true | false>(
    true,
  );
  const [amount, setAmount] = useState<number>(35000);
  const [currency, setCurrency] = useState<string>('default');

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = () => {
    if (isAgreed) {
      setIsOpen({ isOpen: false });
    }
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

  //FORM DATA SUBMISSION
  const submitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('JESUS IS REX');
    setLoading(true);
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
      toast.info('Processing . . .');

      //MAKE REQUEST
      const res = await fetch('/api/crud/verify-supplier-create', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      // if (data.responsex.status == 'SUCCESS') {
      //   navigateWithAlert(
      //     '/dashboard/paystack',
      //     'success',
      //     'We have received your request!',
      //   );
      // }

      if (data.responsex.status == 'SUCCESS') {
        openModal();
        toast.success(data.responsex.message);
      }
      if (data.responsex.status == 'EMPTY_FIELD') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }

    //FORM SUBMISSION ENDS
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
      title: 'OrderID:' + pidVerifySupplier,
      description: 'Payment for Supplier Verification Request',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  } as any;

  ////////////////////////// FLUTTERWAVE PAYMENT //////////////////////////

  return (
    <>
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
        {/* <button onClick={openModal}>Open Modal</button> */}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-blue-950">Proceed to make payment</h2>
          <p className="text-blue-950">
            <b>Amount to pay is $250 or N400,000</b>
          </p>
          <hr />
          <br />
          <RadSelectCurrency
            label={'- Select Currency -'}
            //reacticon={<CurrencyDollarIcon />}
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
          {/* <button
            className="flex items-center gap-2 rounded-2xl bg-blue-800 pb-2 pl-5 pr-5 pt-2 text-white hover:bg-blue-500"
            onClick={() => {
              handleFlutterPayment({
                callback: (response) => {
                  console.log(response);
                  //closePaymentModal(); // this will close the modal programmatically
                },
                onClose: () => {
                  alert('Flutter Payment was not successful');
                },
              });
            }}
            disabled={isCurrencySelected}
          >
            <Image
              loading="lazy"
              src="/icons/bank.svg"
              alt="Logo"
              width={20}
              height={20}
              className="items-center self-center"
            />
            Payment via Flutterwave
          </button> */}

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
            service_name={'VERIFY SUPPLIER'}
            description={'This is the Verify Supplier Service'}
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

      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="" subtitle="">
        <form onSubmit={submitForm}>
          <div className="flex flex-col p-2 md:flex-row">
            <div className="md:w-1/1 w-full">
              <label className="bg:text-slate-200 block text-[16px] font-medium">
                Provide details about your supplier for verification
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
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder={'Enter Supplier Name'}
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
                <RadText
                  label={'Supplier Phone Contact'}
                  reacticon={<IoLogoWhatsapp />}
                  name={'supplierPhone'}
                  id={'supplierPhone'}
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder={'  Enter your supplier contact phone number'}
                  disable={false}
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
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  defaultValue={''}
                  placeholder="Provide the suppliers address"
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
                  onChange={(e) => setSupplierProduct(e.target.value)}
                  placeholder={'Enter Supplier Products'}
                  disable={false}
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
                  onChange={(e) => setSupplierWebsite(e.target.value)}
                  placeholder={'Enter Suppliers website address'}
                  disable={false}
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
                  onChange={(e) => setSupplierDetails(e.target.value)}
                  defaultValue={''}
                  placeholder="Provide additional details about the supplier."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
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
                    1. When you pay and submit your request, our team in China
                    will physically verify the authenticity of the supplier
                    whose details you’ve submitted to us.
                  </div>
                  <div>
                    2. You should receive an email from us within 3 business
                    days with the result of our investigation. This email will
                    be sent to your registered email address in our database.
                  </div>
                  <div>3. Payment for this service is non refundable.</div>

                  <div>Thank you for choosing Spreadit.</div>
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
            </Dialog>

            <Button
              type="submit"
              className="h-[54px] font-medium"
              disabled={!isAgreed}
            >
              Pay and Submit
            </Button>
          </div>
        </form>
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
}

export default SpecialSourcingForm;
