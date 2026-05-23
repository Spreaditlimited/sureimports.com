'use client';

import Loader from '@/components/uix/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import RadButton from '@/components/uix/xForm/RadButton';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
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
import RadPassword from '@/components/uix/xForm/RadPassword';
import { RiLockPasswordFill } from 'react-icons/ri';
import RadFormLayout from '@/components/uix/xForm/RadFormLayout';
import { MdEmail } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';
import { FaMoneyBills } from 'react-icons/fa6';
import RadButtonFunction from '@/components/uix/xForm/RadButtonFunction';
import RadLinkButton from '@/components/uix/xForm/RadLinkButton';
import RadNumber from '@/components/uix/xForm/RadNumber';
import ImageBox from '@/components/uix/ImageBox';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import SkeletalUserCard from '@/components/uix/SkeletalUserCard';
import { Calendar, Edit, Globe, Phone, Tag, User } from 'lucide-react';
import { Mail } from 'lucide-react';

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
}

const ProfileUpdateForm: React.FC<FormProps> = () => {
  //USER DATA
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL
  const [pidUser, setPidUser] = useState(user?.pidUser);

  //IMAGE FILE CONTROL
  const [file, setFile] = useState<File | null>(null);

  //update image with uploaded data
  const handleImageChange = (file: File) => {
    setFile(file);
  };

  //initialize alert system
  const navigateWithAlert = useNavigationWithAlert();

  //SET FORM DATA
  const [userImage, setUserImage] = useState<File | null>(null);

  const [email, setEmail] = useState(user?.userEmail);
  const [fullName, setFullName] = useState(user?.userFirstname);
  const [gender, setGender] = useState(userData?.gender);
  const [dob, setDOB] = useState(userData?.dob);
  const [phone, setPhone] = useState(userData?.phone);
  const [country, setCountry] = useState(userData?.country);
  const [address, setAddress] = useState(userData?.address);
  const [imagex, setImagex] = useState(userData?.userImage);

  //MESSAGE & CONTROLS
  const [message, setMessage] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // alert(userData?.userImage);

  //   const url = (process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL)+'/'+imagex;
  //   const defaultSrc = "/icons/profile-update/default.png";

  //GET USER PROFILE RECORDS
  const fetchUser = async (pidUser: string) => {
    try {
      //request for users
      const res = await fetch(`/api/user/${pidUser}`);

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: userData = await res.json();

      //update user records variables
      setUserData(data);
      setPidUser(data.pidUser);
      setFullName(data.userFirstname);
      setGender(data.gender);
      setDOB(data.dob);
      setPhone(data.phone);
      setCountry(data.country);
      setAddress(data.address);
      setImagex(data.userImage);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  //run fetchUser function to get user records
  useEffect(() => {
    if (pidUser) {
      fetchUser(pidUser);
    }
  }, [pidUser]);

  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM
  if (!userData) return <Loader />;

  //FORM DATA SUBMISSION
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    setLoading(true);
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const formData = new FormData() as any;
    formData.append('file', file);
    formData.append('userImage', userImage);
    formData.append('pidUser', pidUser);
    formData.append('email', email);
    formData.append('fullName', fullName);
    formData.append('gender', gender);
    formData.append('dob', dob);
    formData.append('phone', phone);
    formData.append('country', country);
    formData.append('address', address);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing . . .');
      //MAKE REQUEST
      const res = await fetch('/api/profile-update', {
        method: 'POST',
        body: formData,
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      //if (data.responsex.status == 'SUCCESS'){navigateWithAlert('/dashboard', 'success', 'Action was successfully!');}
      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
      }
      if (data.responsex.status == 'INVALID_IMAGE_UPLOAD') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'IMAGE_UPLOAD_FAILED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'NO_IMAGE_SELECTED') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'EMPTY_DETAILS') {
        toast.warning(data.responsex.message);
      }
      if (data.responsex.status == 'FAILED_PROFILE_UPDATE') {
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
      {/*.................................. FORM BLOCK STARTS.................................... */}
      <RadFormLayout title="User Account Profile" subtitle="">
        <form onSubmit={submitForm}>
          {/* ///////////////////// IMAGE UPLOAD BOX ///////////////////// */}
          <div className="flex flex-col p-2 dark:bg-black md:flex-row">
            <div className="md:w-1/1 w-full">
              <label className="block text-sm font-medium text-gray-400">
                Upload Profile Picture
              </label>

              <div className="flex">
                <ImageBox onImageChange={handleImageChange} imagex={imagex} />
              </div>

              {/* <div className="ml-[16px] text-[12px] font-normal text-slate-600 dark:text-slate-400 max-sm:text-[10px]">
                      Max image size 2.5MB (Use a square sized photo e.g. 150px
                      x 150px for best fit.)
                  </div> */}
            </div>
          </div>

          {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
          <div className="flex flex-col dark:bg-black md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Email'}
                  reacticon={<Mail className="text-gray-400" />}
                  name={'fullname'}
                  id={'fullname'}
                  value={email}
                  disable={true}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Full Name'}
                  reacticon={<User className="text-gray-400" />}
                  name={'fullname'}
                  id={'fullname'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disable={false}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
          <div className="flex flex-col dark:bg-black md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadSelectGender
                  label={'Gender'}
                  reacticon={<Tag className="text-gray-400" />}
                  name={'gender'}
                  id={'gender'}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 2 */}
              <div>
                <RadDateSelector
                  label={'Date of Birth'}
                  reacticon={<Calendar className="text-gray-400" />}
                  name={'dob'}
                  id={'dob'}
                  value={dob}
                  onChange={(e) => setDOB(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
          <div className="flex flex-col dark:bg-black md:flex-row">
            <div className="w-full p-2 md:w-1/2">
              {/* COL 1 */}
              <div>
                <RadText
                  label={'Contact'}
                  reacticon={<Phone className="text-gray-400" />}
                  name={'phone'}
                  id={'phone'}
                  value={phone}
                  placeholder="Contact Phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full p-2 md:w-1/2">
              {/* COL 2 */}
              <div>
                <RadSelectOption
                  label={'Country'}
                  reacticon={<Globe className="text-gray-400" />}
                  name={'country'}
                  id={'country'}
                  xrecords={countries}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* TWO COLUMN: BANK NAME & ACCOUNT NUMBER */}
          <div className="flex flex-col dark:bg-black md:flex-row">
            <div className="md:w-1/1 w-full p-2">
              {/* COL 2 */}
              <div>
                <RadTextArea
                  label="Address"
                  name="address"
                  id="address"
                  value={address}
                  defaultValue={userData.address}
                  placeholder="2 Oremeji Street, Agodo, Egbe, Lagos"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ///////////////////// SUBMIT BUTTON ///////////////////// */}
          <div className="flex justify-end">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/1 w-full p-2">
                <RadButtonIcon
                  label="Update Profile Details"
                  reacticon={<Edit className="text-gray-400" />}
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
};

export default ProfileUpdateForm;
