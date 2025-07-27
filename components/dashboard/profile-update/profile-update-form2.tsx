'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Toast } from '@radix-ui/react-toast';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Calendarx } from '@/components/ui/calendarx';
import { useAuth } from '@/app/context/AuthContext';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/_lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CommandList } from 'cmdk';

import { Input } from '@/components/ui/input-with-dark-mode';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import React from 'react';

// const plan = [
//   { label: 'Nigeria', value: 'Nigeria' },
//   { label: 'USA', value: 'USA' },
//   { label: 'Quatar', value: 'Quatar' },
//   { label: 'UAE', value: 'UAE' },
//   { label: 'China', value: 'China' },
//   { label: 'UK', value: 'UK' },
//   { label: 'India', value: 'India' },
// ] as const;

const plan = [
  { label: 'Afghanistan', value: 'Afghanistan' },
  { label: 'Albania', value: 'Albania' },
  { label: 'Algeria', value: 'Algeria' },
  { label: 'Andorra', value: 'Andorra' },
  { label: 'Angola', value: 'Angola' },
  { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
  { label: 'Argentina', value: 'Argentina' },
  { label: 'Armenia', value: 'Armenia' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Austria', value: 'Austria' },
  { label: 'Azerbaijan', value: 'Azerbaijan' },
  { label: 'Bahamas', value: 'Bahamas' },
  { label: 'Bahrain', value: 'Bahrain' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Barbados', value: 'Barbados' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Belgium', value: 'Belgium' },
  { label: 'Belize', value: 'Belize' },
  { label: 'Benin', value: 'Benin' },
  { label: 'Bhutan', value: 'Bhutan' },
  { label: 'Bolivia', value: 'Bolivia' },
  { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
  { label: 'Botswana', value: 'Botswana' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Brunei', value: 'Brunei' },
  { label: 'Bulgaria', value: 'Bulgaria' },
  { label: 'Burkina Faso', value: 'Burkina Faso' },
  { label: 'Burundi', value: 'Burundi' },
  { label: 'Cabo Verde', value: 'Cabo Verde' },
  { label: 'Cambodia', value: 'Cambodia' },
  { label: 'Cameroon', value: 'Cameroon' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Central African Republic', value: 'Central African Republic' },
  { label: 'Chad', value: 'Chad' },
  { label: 'Chile', value: 'Chile' },
  { label: 'China', value: 'China' },
  { label: 'Colombia', value: 'Colombia' },
  { label: 'Comoros', value: 'Comoros' },
  { label: 'Congo', value: 'Congo' },
  { label: 'Costa Rica', value: 'Costa Rica' },
  { label: 'Croatia', value: 'Croatia' },
  { label: 'Cuba', value: 'Cuba' },
  { label: 'Cyprus', value: 'Cyprus' },
  { label: 'Czech Republic', value: 'Czech Republic' },
  { label: 'Denmark', value: 'Denmark' },
  { label: 'Djibouti', value: 'Djibouti' },
  { label: 'Dominica', value: 'Dominica' },
  { label: 'Dominican Republic', value: 'Dominican Republic' },
  { label: 'East Timor', value: 'East Timor' },
  { label: 'Ecuador', value: 'Ecuador' },
  { label: 'Egypt', value: 'Egypt' },
  { label: 'El Salvador', value: 'El Salvador' },
  { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
  { label: 'Eritrea', value: 'Eritrea' },
  { label: 'Estonia', value: 'Estonia' },
  { label: 'Eswatini', value: 'Eswatini' },
  { label: 'Ethiopia', value: 'Ethiopia' },
  { label: 'Fiji', value: 'Fiji' },
  { label: 'Finland', value: 'Finland' },
  { label: 'France', value: 'France' },
  { label: 'Gabon', value: 'Gabon' },
  { label: 'Gambia', value: 'Gambia' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Greece', value: 'Greece' },
  { label: 'Grenada', value: 'Grenada' },
  { label: 'Guatemala', value: 'Guatemala' },
  { label: 'Guinea', value: 'Guinea' },
  { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
  { label: 'Guyana', value: 'Guyana' },
  { label: 'Haiti', value: 'Haiti' },
  { label: 'Honduras', value: 'Honduras' },
  { label: 'Hungary', value: 'Hungary' },
  { label: 'Iceland', value: 'Iceland' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Iran', value: 'Iran' },
  { label: 'Iraq', value: 'Iraq' },
  { label: 'Ireland', value: 'Ireland' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Jamaica', value: 'Jamaica' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Jordan', value: 'Jordan' },
  { label: 'Kazakhstan', value: 'Kazakhstan' },
  { label: 'Kenya', value: 'Kenya' },
  { label: 'Kiribati', value: 'Kiribati' },
  { label: 'Korea, North', value: 'Korea, North' },
  { label: 'Korea, South', value: 'Korea, South' },
  { label: 'Kosovo', value: 'Kosovo' },
  { label: 'Kuwait', value: 'Kuwait' },
  { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
  { label: 'Laos', value: 'Laos' },
  { label: 'Latvia', value: 'Latvia' },
  { label: 'Lebanon', value: 'Lebanon' },
  { label: 'Lesotho', value: 'Lesotho' },
  { label: 'Liberia', value: 'Liberia' },
  { label: 'Libya', value: 'Libya' },
  { label: 'Liechtenstein', value: 'Liechtenstein' },
  { label: 'Lithuania', value: 'Lithuania' },
  { label: 'Luxembourg', value: 'Luxembourg' },
  { label: 'Madagascar', value: 'Madagascar' },
  { label: 'Malawi', value: 'Malawi' },
  { label: 'Malaysia', value: 'Malaysia' },
  { label: 'Maldives', value: 'Maldives' },
  { label: 'Mali', value: 'Mali' },
  { label: 'Malta', value: 'Malta' },
  { label: 'Marshall Islands', value: 'Marshall Islands' },
  { label: 'Mauritania', value: 'Mauritania' },
  { label: 'Mauritius', value: 'Mauritius' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Micronesia', value: 'Micronesia' },
  { label: 'Moldova', value: 'Moldova' },
  { label: 'Monaco', value: 'Monaco' },
  { label: 'Mongolia', value: 'Mongolia' },
  { label: 'Montenegro', value: 'Montenegro' },
  { label: 'Morocco', value: 'Morocco' },
  { label: 'Mozambique', value: 'Mozambique' },
  { label: 'Myanmar', value: 'Myanmar' },
  { label: 'Namibia', value: 'Namibia' },
  { label: 'Nauru', value: 'Nauru' },
  { label: 'Nepal', value: 'Nepal' },
  { label: 'Netherlands', value: 'Netherlands' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'Nicaragua', value: 'Nicaragua' },
  { label: 'Niger', value: 'Niger' },
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'North Macedonia', value: 'North Macedonia' },
  { label: 'Norway', value: 'Norway' },
  { label: 'Oman', value: 'Oman' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'Palau', value: 'Palau' },
  { label: 'Palestine', value: 'Palestine' },
  { label: 'Panama', value: 'Panama' },
  { label: 'Papua New Guinea', value: 'Papua New Guinea' },
  { label: 'Paraguay', value: 'Paraguay' },
  { label: 'Peru', value: 'Peru' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Poland', value: 'Poland' },
  { label: 'Portugal', value: 'Portugal' },
  { label: 'Qatar', value: 'Qatar' },
  { label: 'Romania', value: 'Romania' },
  { label: 'Russia', value: 'Russia' },
  { label: 'Rwanda', value: 'Rwanda' },
  { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
  { label: 'Saint Lucia', value: 'Saint Lucia' },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'Saint Vincent and the Grenadines',
  },
  { label: 'Samoa', value: 'Samoa' },
  { label: 'San Marino', value: 'San Marino' },
  { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
  { label: 'Saudi Arabia', value: 'Saudi Arabia' },
  { label: 'Senegal', value: 'Senegal' },
  { label: 'Serbia', value: 'Serbia' },
  { label: 'Seychelles', value: 'Seychelles' },
  { label: 'Sierra Leone', value: 'Sierra Leone' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Slovakia', value: 'Slovakia' },
  { label: 'Slovenia', value: 'Slovenia' },
  { label: 'Solomon Islands', value: 'Solomon Islands' },
  { label: 'Somalia', value: 'Somalia' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'South Sudan', value: 'South Sudan' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
  { label: 'Sudan', value: 'Sudan' },
  { label: 'Suriname', value: 'Suriname' },
  { label: 'Sweden', value: 'Sweden' },
  { label: 'Switzerland', value: 'Switzerland' },
  { label: 'Syria', value: 'Syria' },
  { label: 'Taiwan', value: 'Taiwan' },
  { label: 'Tajikistan', value: 'Tajikistan' },
  { label: 'Tanzania', value: 'Tanzania' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Togo', value: 'Togo' },
  { label: 'Tonga', value: 'Tonga' },
  { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
  { label: 'Tunisia', value: 'Tunisia' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Turkmenistan', value: 'Turkmenistan' },
  { label: 'Tuvalu', value: 'Tuvalu' },
  { label: 'Uganda', value: 'Uganda' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' },
  { label: 'Uruguay', value: 'Uruguay' },
  { label: 'Uzbekistan', value: 'Uzbekistan' },
  { label: 'Vanuatu', value: 'Vanuatu' },
  { label: 'Vatican City', value: 'Vatican City' },
  { label: 'Venezuela', value: 'Venezuela' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Yemen', value: 'Yemen' },
  { label: 'Zambia', value: 'Zambia' },
  { label: 'Zimbabwe', value: 'Zimbabwe' },
] as const;

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
    <div className="pt-[25px]">
      <div className="mb-[25px] border-b pb-[20px] text-xl font-bold text-slate-800 dark:text-white">
        <div className="ml-[25px]">User Account Profile</div>
      </div>
      <div className="ml-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-3 pb-[25px]">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="userImage"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="w-full">
                      <FormLabel>Upload Profile Picture</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <label className="dark:hover:bg-bray-800 mr-[25px] flex h-[94px] w-full cursor-pointer items-center rounded-[10px] border border-dashed bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={
                                previewUrl ??
                                '/icons/profile-update/default.png'
                              }
                              alt="image"
                              width={70}
                              height={70}
                              className="m-3"
                            />
                            <div className="hidden">
                              {value && <p>Current file</p>}
                            </div>
                            <div>
                              <Input
                                id="productImage"
                                type="file"
                                className="border"
                                onChange={(e) => {
                                  handleFileChange(e);
                                  onChange(e.target.files?.[0]);
                                }}
                                {...fieldProps}
                              />

                              <div className="ml-[16px] text-sm font-normal text-slate-600 dark:text-slate-400 max-sm:text-xs">
                                Max image size 2.5MB (Use a square sized photo
                                e.g. 150px x 150px for best fit.)
                              </div>
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex w-full flex-col gap-3 pr-[25px] lg:flex-row">
                <div className="space-y-[25px] lg:w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl className="col-span-6">
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/add-product/email.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-2 lg:m-5"
                            />

                            <Input
                              className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full"
                              placeholder="-"
                              disabled
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Gender </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={selectedGender}
                        >
                          <FormControl>
                            <div className="item-center relative flex">
                              <Image
                                src="/icons/profile-update/gender.svg"
                                alt="search"
                                width={20}
                                height={20}
                                className="absolute m-2 lg:m-5"
                              />
                              <SelectTrigger className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full">
                                <SelectValue placeholder="Select a the gender" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male" aria-selected>
                              male
                            </SelectItem>
                            <SelectItem value="female">female</SelectItem>
                            <SelectItem value="other">other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact No.</FormLabel>
                        <FormControl>
                          <div className="item-center relative flex max-md:pb-[15px]">
                            <Image
                              src="/icons/profile-update/phone.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-2 lg:m-5"
                            />
                            <Input
                              className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full"
                              placeholder="Contact Number"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-[34px] lg:w-full">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="item-center relative flex">
                            <Image
                              src="/icons/add-product/name.svg"
                              alt="search"
                              width={20}
                              height={20}
                              className="absolute m-2 lg:m-5"
                            />

                            <Input
                              className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full"
                              placeholder="Tochukwu Nkwocha"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    //control={form.control}
                    //name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Calendarx
                                //type="button"
                                //variant={'outline'}
                                //mode="single"
                                name="dob"
                                onChange={onChangeDOB}
                                value={dob}
                                initialFocus
                                className={
                                  'rounded-lg bg-slate-100 pl-12 dark:bg-slate-800 max-sm:w-[340px] md:w-full lg:h-[60px]'
                                }
                              />

                              {/* <div className="item-center relative flex">
              <Button
                type="button"
                variant={'outline'}
                className={cn(
                  'bg-slate-100 pl-12 dark:bg-slate-800 max-sm:w-[340px] md:w-full lg:h-[60px]',
                  !field.value && 'text-muted-foreground',
                )}
              >
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>MM/DD/YYYY</span>
                )}
                <Image
                  src="/icons/profile-update/date.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="ml-auto h-4 w-4"
                />
              </Button>
            </div> */}
                            </FormControl>
                          </PopoverTrigger>

                          {/* <PopoverContent className="w-auto p-0" align="start"> */}

                          {/* <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() ||
                date < new Date('1900-01-01')
              }
              initialFocus
            /> */}

                          {/* </PopoverContent> */}
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                    name={''}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex flex-col max-md:pb-[15px]">
                        <FormLabel>Country</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div className="item-center relative flex w-full">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    'flex justify-start bg-slate-100 dark:bg-slate-800 max-sm:w-[340px] md:w-full lg:h-[60px]',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? plan.find(
                                        (plan) => plan.value === field.value,
                                      )?.label
                                    : 'Select'}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search Type" />
                              <CommandEmpty>No subjects</CommandEmpty>
                              <CommandGroup>
                                {plan.map((plan) => (
                                  <CommandList key={plan.value}>
                                    <CommandItem
                                      value={plan.label}
                                      onSelect={() => {
                                        form.setValue('country', plan.value);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          plan.value === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {plan.label}
                                    </CommandItem>
                                  </CommandList>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="col-span-8 flex justify-start" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col pr-[25px]">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Textarea
                            className="bg-slate-100 max-sm:w-[340px] lg:h-32 lg:w-full"
                            placeholder="2 Oremeji Street, Agodo, Egbe, Lagos"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="col-span-8 flex justify-start" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex pr-[25px] md:justify-end">
              <Button
                type="submit"
                className="item-center mb-[25px] h-[49px] gap-2 text-base font-medium lg:w-[203px]"
              >
                <Image
                  src="/icons/profile-update/user.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="fill-white"
                />
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileUpdateForm;
