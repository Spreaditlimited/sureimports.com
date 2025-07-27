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
import { Currency, Loader2 } from 'lucide-react';

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
  let productID = 'SS' + new Date().getTime().toString();

  //ENABLE & DISABLE VARIABLES
  //const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const { isModalOpen, openModal, closeModal } = useModal();
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [pidSpecialSourcing, setPidSpecialSourcing] = useState(productID);
  const [email, setEmail] = useState(user?.userEmail);
  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [userEmail, setUserEmail] = useState(user?.userEmail);
  const [fullName, setFullName] = useState(user?.userFirstname);
  const [file, setFile] = useState<File | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [productQualityRatings, setProductQualityRatings] =
    useState<string>('');
  const [targetUnitPrice, setTargetUnitPrice] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCurrencySelected, setIsCurrencySelected] = useState<true | false>(
    true,
  );
  const [amount, setAmount] = useState<number>(35000);
  const [currency, setCurrency] = useState<string>('default');

  //update image with uploaded data
  const handleImageChange = (file: File) => {
    setFile(file);
  };

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
      setAmount(50000);
    }
    if (currency == 'NGN') {
      setAmount(50000);
    }
    if (currency == 'USD') {
      setAmount(50);
    }
  }, [currency]);

  //FORM DATA SUBMISSION
  const submitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    setLoading(true);
  };

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    setLoading(true);

    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('file', file);
    formData.append('pidUser', pidUser);
    formData.append('pidSpecialSourcing', pidSpecialSourcing);
    formData.append('userEmail', userEmail);
    formData.append('productName', productName);
    formData.append('whatsappNumber', whatsappNumber);
    formData.append('productQualityRatings', productQualityRatings);
    formData.append('targetUnitPrice', targetUnitPrice);
    formData.append('productDescription', productDescription);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');

      //MAKE REQUEST
      const res = await fetch('/api/special-sourcing', {
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
      if (data.responsex.status == 'EMPTY_DETAILS') {
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
      setLoading(false);
    }

    //FORM SUBMISSION ENDS
  };

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
            <b>Amount to pay is $50 or N50,000</b>
          </p>
          <hr />
          <br />
          <RadSelectCurrency
            label={'- Select Currency -'}
            reacticon={<CurrencyDollarIcon />}
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
            service_name={'PROCUREMENT'}
            description={'This is General Procuremnt & Shipping Service'}
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
      <RadFormLayout title="Source Product" subtitle="">
        <form onSubmit={submitForm}>
          <div className="flex flex-col p-2 md:flex-row">
            <div className="md:w-1/1 w-full">
              <label className="bg:text-slate-400 block text-[16px] font-medium">
                Even if you want us to source more than one product, kindly
                provide the details of just one product.
              </label>
            </div>
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="dark:hover:bg-bray-800 flex h-72 w-full cursor-pointer flex-col justify-center rounded-[10px] border border-dashed border-indigo-800 bg-indigo-800/10">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <ImageBoxLarge
                  onImageChange={handleImageChange}
                  imagex={file}
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
                  label={''}
                  reacticon={<FaBox />}
                  name={'productName'}
                  id={'productName'}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
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
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder={'  Enter your Whatsapp number'}
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
                  onChange={(e) => setProductQualityRatings(e.target.value)}
                  placeholder={'  Enter target product quantity'}
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
                  onChange={(e) => setTargetUnitPrice(e.target.value)}
                  placeholder={'  Enter target unit price in RMB'}
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
                  onChange={(e) => setProductDescription(e.target.value)}
                  //defaultValue={''}
                  placeholder="   Describe what exactly you want"
                />
              </div>
            </div>
          </div>

          {/* ///////////////////// SUBMIT BUTTON ///////////////////// */}
          {/* <div className="flex justify-end">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <RadButtonIcon
                  label="Update Profile Details"
                  reacticon={<FaUserEdit />}
                  value={'formaction'}
                />
              </div>
            </div>
          </div> */}

          <div className="flex flex-col">
            <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button variant="link" type="button">
                  view terms and conditions
                </Button>
              </DialogTrigger>
              <DialogContent className="flex h-[60vh] flex-col overflow-hidden p-0 dark:bg-[#161629] max-md:h-[90vh] lg:max-w-[800px]">
                <DialogHeader className="bg-whitex sticky top-0 bg-[#ffffff] px-6 py-4 dark:bg-[#161629]">
                  <DialogTitle>Read Our Terms</DialogTitle>
                </DialogHeader>
                <div className="dark flex flex-grow flex-col gap-5 overflow-y-auto px-6 py-4 text-sm">
                  <div>
                    In buying from China, MOQ (Minimum Order Quantity) is
                    extremely important.
                  </div>
                  <div>
                    Unit prices drop when quantity increases. Someone importing
                    a 40 ft container of an item will sell cheaper than you if
                    you wish to import a smaller quantity.
                  </div>
                  <div>
                    Also, you must consider if the product you wish to import is
                    already ubiquitous in your local market. If it is, please,
                    consider buying from your local market as we may not be able
                    to get you a better price.
                  </div>
                  <div className="font-medium">
                    We are here to serve you if:
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      1. you are not satisfied with the quality of the product
                      in your local market and want to get the best.
                    </div>
                    <div>
                      2. the products you wish to import are scarce or
                      unavailable in your local market.
                    </div>
                    <div>
                      3. you wish to import a large quantity of a product so as
                      to compete favorably in your local market.
                    </div>
                  </div>
                  <div>
                    The product sourcing commitment fee you{"'"}ll pay will only
                    be refunded when you go ahead to place an order based on the
                    best quote we give you.
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
