'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import RadButton from '@/components/uix/xForm/RadButton';
import { toast } from 'sonner';

import { useAuth } from '@/app/context/AuthContext';

import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { ChangeEvent, useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import React from 'react';
import RadButtonIcon from '@/components/uix/xForm/RadButtonIcon';
import RadTextArea from '@/components/uix/xForm/RadTextArea';
import RadText from '@/components/uix/xForm/RadText';
import { FaCalendarAlt, FaPhone } from 'react-icons/fa';
import RadSelectGender from '@/components/uix/xForm/RadSelectGender';
import { PiGenderIntersex } from 'react-icons/pi';
import countries from '@/lib/data/countries';
import RadSelectOption from './xForm/RadSelectOption';
import { BiWorld } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import RadDateSelector from './xForm/RadDateSelector';
import RadPassword from './xForm/RadPassword';
import { RiLockPasswordFill } from 'react-icons/ri';
import RadFormLayout from './xForm/RadFormLayout';
import { MdEmail } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';
import { FaMoneyBills } from 'react-icons/fa6';
import RadButtonFunction from './xForm/RadButtonFunction';
import RadLinkButton from './xForm/RadLinkButton';
import RadNumber from './xForm/RadNumber';

const formSchema = z.object({
  userImage: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: 'picture must be less than 2.5MB.',
  }),
  email: z.string().email({
    message: 'Email is required',
  }),
  fullName: z
    .string()
    .min(2, {
      message: 'Name is required',
    })
    .max(500),
  gender: z.string().min(2, { message: 'Please choose a gender' }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  contactNo: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' }),
  country: z.string().min(2, { message: 'Please select a valid country' }),
  address: z.string().min(2, { message: 'Please enter a valid address' }),
});

interface ReportFormProps {}

interface userData {
  id: number;
  pidUser: string;
  userEmail: string;
  userFirstname: string;
  gender: string;
  dob: Date | undefined;
  phone: string;
  country: string;
  // bank_name: string;
  // bank_account_number: string;
  // bank_account_name: string;
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
  // Add other properties as needed
}

const ProfileUpdateForm: React.FC<ReportFormProps> = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<userData>();

  const pidUser = user?.pidUser;
  const userEmail = user?.email;
  const userFirstname = user?.name;
  const gender = userData?.gender;
  const dob = userData?.dob;
  const phone = userData?.phone;
  const country = userData?.country;
  // const bank_name =  userData?.bank_name;
  // const bank_account_number =  userData?.bank_account_number;
  // const bank_account_name =  userData?.bank_account_name;

  //const pidUser = user?.pidUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userImage: undefined,
      //pidUser: pidUser,
      email: userEmail,
      fullName: userFirstname,
      gender: gender,
      dob: dob,
      contactNo: phone,
      country: country,
      // bank_name: bank_name,
      // bank_account_number: bank_account_number,
      // bank_account_name: bank_account_name,
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [message, setMessage] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //alert(values.userImage);
    console.log(values);
    console.log(file);

    setLoading(true);
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const userImage = values.userImage;
    const pidUser = user?.pidUser;
    const email = values.email;
    const fullName = values.fullName;
    const gender = values.gender;
    //const dob = values.dob;
    const phone = values.contactNo;
    const country = values.country;
    const address = values.address;

    const formData = new FormData() as any;
    formData.append('file', file);
    formData.append('userImage', userImage);
    formData.append('pidUser', pidUser);
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('gender', gender);
    formData.append('dob', dobx);
    formData.append('phone', phone);
    formData.append('country', country);
    formData.append('address', address);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Updating . . .');
      //MAKE REQUEST
      const res = await fetch('/api/profile-update', {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        //headers: { 'Content-Type': 'multipart/form-data' },
        //body: JSON.stringify({ file, userImage, email, fullName, gender, contactNo, country }),
        //body: JSON.stringify({ file, values}),
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      //alert(data.responsex.status);
      //if (!file) {toast.error('No Product Image selected'); setIsLoading(false); return;}else{}

      if (data.responsex.status == 'NO_IMAGE') {
        toast.info(data.responsex.message);
        // setMessage(data.responsex.message);
        // setLoading(false);
        //await new Promise((resolve) => setTimeout(resolve, 5000));
        //router.push('/auth/login');
      }

      if (data.responsex.status == 'ACTION_SUCCESSFUL') {
        toast.success(data.responsex.message);
        //router.push('/auth/login');
        // setMessage(data.responsex.message);
        // setLoading(false);
      }

      if (data.responsex.status == 'ACTION_FAILED') {
        toast.error(data.responsex.message);
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      form.setValue('userImage', selectedFile);
    }
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const [dobx, onChangeDOB] = useState<any>(new Date());

  const [selectedGender, setSelectedGender] = useState<
    'male' | 'female' | 'other'
  >('male');
  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(event.target.value as 'male' | 'female' | 'other');
  };

  ///////////////////////// FETCH PROFILE DATA ///////////////////////////
  const fetchUserData = async (pidUser: string) => {
    const response = await fetch(`/api/user/${pidUser}`);
    const data = await response.json();
    setUserData(data);
  };

  useEffect(() => {
    if (pidUser) {
      // Call the server-side API route with the URL parameter
      fetchUserData(pidUser);
    }
  }, [pidUser]);

  //const gender = userData?.gender as string;
  if (!userData) return <p>Loading...</p>;

  ///////////////////////// FETCH PROFILE DATA ///////////////////////////

  // return (
  //   <div>
  //     <h1>User Details</h1>
  //     <p>ID: {userData.id}</p>
  //     <p>Name: {userData.userFirstname}</p>
  //     <p>Email: {userData.userEmail}</p>
  //     <p>Gender: {userData.gender}</p>
  //     <p>Phone: {userData.userPhone}</p>
  //     <p>Country: {userData.userCountry}</p>
  //   </div>
  // );

  return (
    <>
      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="Form Title" subtitle="This is a form subtitle">
        <form>
          {/* ///////////////////// IMAGE UPLOAD BOX ///////////////////// */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            <label className="block text-sm font-medium text-gray-700">
              Upload Profile Picture
            </label>
            <div className="flex">
              <label className="dark:hover:bg-bray-800 mr-[25px] flex h-[94px] w-full cursor-pointer items-center rounded-[10px] border border-dashed bg-slate-100 dark:bg-slate-800">
                <Image
                  src={previewUrl ?? '/icons/profile-update/default.png'}
                  alt="image"
                  width={70}
                  height={70}
                  className="m-3"
                />

                <div>
                  <Input
                    name="userImage"
                    id="userImage"
                    type="file"
                    className="border"
                  />

                  <div className="ml-[16px] text-sm font-normal text-slate-600 dark:text-slate-400 max-sm:text-xs">
                    Max image size 2.5MB (Use a square sized photo e.g. 150px x
                    150px for best fit.)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ////////////////////// TWO COL: EMAIL & FULL NAME */}
          <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2">
            {/* COL 1 */}
            <div>
              <RadText
                label={'Email'}
                reacticon={<MdEmail />}
                name={'fullname'}
                id={'fullname'}
                disable={false}
              />
            </div>

            {/* COL 2 */}
            <div>
              <RadText
                label={'Full Name'}
                reacticon={<FaUserCheck />}
                name={'fullname'}
                id={'fullname'}
                disable={false}
              />
            </div>
          </div>

          {/* ////////////////////// TWO COL: GENDER & DATE OF BIRTH */}
          <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2">
            {/* COL 1 */}
            <div>
              <RadSelectGender
                label={'Gender'}
                reacticon={<PiGenderIntersex />}
                name={'gender'}
                id={'gender'}
              />
            </div>

            {/* COL 2 */}
            <div>
              <RadDateSelector
                label={'Date of Birth'}
                reacticon={<FaCalendarAlt />}
                name={'dob'}
                id={'dob'}
              />
            </div>
          </div>

          {/* ////////////////////// TWO COL: CONTACT & COUNTRY*/}
          <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2">
            {/* COL 1 */}
            <div>
              <RadText
                label={'Contact'}
                reacticon={<FaPhone />}
                name={'phone'}
                id={'phone'}
                placeholder="Contact Phone"
              />
            </div>

            {/* COL 2 */}
            <div>
              <RadSelectOption
                label={'Country'}
                reacticon={<BiWorld />}
                name={'country'}
                id={'country'}
                xrecords={countries}
              />
            </div>
          </div>

          {/* ///////////////////// ADDRESS ///////////////////// */}
          <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-1">
            <RadTextArea
              label="Address"
              name="address"
              id="address"
              placeholder="2 Oremeji Street, Agodo, Egbe, Lagos"
            />
          </div>

          {/* ///////////////////// SUBMIT BUTTON ///////////////////// */}
          <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-1">
            <div className="flex pr-[0px] md:justify-end">
              <RadButtonIcon
                label="Update Profile"
                reacticon={<FaUserEdit />}
              />
            </div>
          </div>

          <RadLinkButton
            label={'Link to Dashboard'}
            reacticon={<FaMoneyBills />}
            link={'/dashboard'}
          />
          <RadNumber
            label={'Price'}
            reacticon={<FaMoneyBills />}
            name={'price'}
            id={'price'}
          />
        </form>
      </RadFormLayout>
      {/*.................................. FORM BLOCK ENDS .................................... */}
    </>
  );
};

export default ProfileUpdateForm;
