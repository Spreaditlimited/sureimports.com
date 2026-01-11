'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Metadata } from 'next';
import { useAuth } from '@/app/context/AuthContext';
import { getAffiliateReference } from '@/utils/affiliateUtils';
import { toast } from 'sonner';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z
  .object({
    userAffiliateRef: z.string(),
    userFirstname: z.string().min(1, {
      message: 'Firstname is required.',
    }),
    userLastname: z.string().min(1, {
      message: 'Lastname is required.',
    }),
    email: z.string().email({
      message: 'Invalid email address.',
    }),
    phone: z.string().min(5, {
      message: 'Invalid phone number.',
    }),
    password: z.string().min(6, {
      message: 'Password must have a minimum of six characters.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must have a minimum of six characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

////////////////////// INPUT FIELDS COMPONENTS //////////////////////
type FormValues = z.infer<typeof formSchema>;

interface InputFieldProps {
  name: keyof FormValues;
  control: Control<FormValues>;
  label?: string;
  type: string;
  placeholder?: string;
  iconSrc?: string;
  description?: string;
  password?: boolean;
  isPasswordVisible?: boolean;
  defaultValue?: string;
  togglePasswordVisibility?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  label,
  type,
  placeholder,
  iconSrc,
  description,
  password = false,
  isPasswordVisible = false,
  defaultValue = '',
  togglePasswordVisibility,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm text-slate-600">{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Image
              loading="lazy"
              src={iconSrc as any}
              alt=""
              width={20}
              height={20}
              className="absolute m-5 h-5 w-5 shrink-0"
            />
            {password && (
              <Image
                loading="lazy"
                src={
                  isPasswordVisible
                    ? '/icons/visible.svg'
                    : '/icons/invisible.png'
                }
                alt=""
                width={20}
                height={20}
                className="absolute right-0 m-5 h-5 w-5 shrink-0 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            )}
            <Input
              type={
                type === 'hidden' ? 'hidden' : isPasswordVisible ? 'text' : type
              }
              placeholder={placeholder}
              aria-label={label}
              className={
                type === 'hidden'
                  ? 'hidden'
                  : 'mt-2 flex h-[60px] items-center rounded-[10px] border-none px-[50px]'
              }
              {...field}
              value={field.value}
              defaultValue={field.value}
            />
          </div>
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

////////////////////// MAIN FORM : SIGNUP //////////////////////
interface SignupPageProps {
  message: string;
  form: UseFormReturn<FormValues>;
  isPasswordVisible: boolean;
  isLoading: boolean;
  togglePasswordVisibility: () => void;
  onSubmit: (data: FormValues) => Promise<void>;
}

const SignupPage: React.FC<SignupPageProps> = ({
  message,
  form,
  isPasswordVisible,
  isLoading,
  togglePasswordVisibility,
  onSubmit,
}) => (
  <div className="relative flex min-h-screen flex-col items-center justify-center bg-white">
    <Image
      loading="lazy"
      src="/images/background.png"
      alt=""
      layout="fill"
      objectFit="cover"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="relative flex w-full max-w-full flex-col items-center px-2 sm:px-16">
      <Card className="relative my-5 w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl sm:p-10">
        <CardHeader className="mt-0 p-0 text-center">
          <Link href="/" className="self-center">
            <Image
              loading="lazy"
              src="/images/svg-logo.svg"
              alt="Logo"
              width={144}
              height={48}
              className="mb-4 h-12 w-96 self-center"
            />
          </Link>
          <div className="text-sm font-bold text-indigo-800">
            Join over <span className="font-bold text-store-blue">30,000</span>{' '}
            Customers today
          </div>
          <h1 className="mt-1.5 text-3xl font-extrabold text-slate-800">
            Create a Free Account
          </h1>
        </CardHeader>

        <CardContent className="mb-0 mt-10 px-0 py-0">
          <Form {...form}>
            <form
              className="flex flex-col space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Hidden affiliate reference field */}
              <InputField
                name="userAffiliateRef"
                control={form.control}
                type="hidden"
                defaultValue={form.getValues('userAffiliateRef')}
                placeholder=""
                iconSrc=""
              />

              <InputField
                name="userFirstname"
                control={form.control}
                //label="First Name"
                type="text"
                placeholder="Enter Your Firstname"
                iconSrc="/icons/user.svg"
              />

              <InputField
                name="userLastname"
                control={form.control}
                //label="Last Name"
                type="text"
                placeholder="Enter Your Lastname"
                iconSrc="/icons/user.svg"
              />

              <InputField
                name="email"
                control={form.control}
                //label="Email"
                type="email"
                placeholder="Enter Your Email"
                iconSrc="/icons/mail.svg"
              />

              <InputField
                name="phone"
                control={form.control}
                //label="Last Name"
                type="text"
                placeholder="Enter Your Phone"
                iconSrc="/icons/phone.svg"
              />

              <InputField
                name="password"
                control={form.control}
                label="Password"
                type="password"
                password={true}
                isPasswordVisible={isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
                placeholder="*****************"
                iconSrc="/icons/password.svg"
              />
              <InputField
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
                type="password"
                password={true}
                isPasswordVisible={isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
                placeholder="*****************"
                iconSrc="/icons/password.svg"
              />
              <Button
                type="submit"
                className="mt-8 h-14 py-3.5"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
              </Button>

              {message && <p className="text-red-600">{message}</p>}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="mt-5 flex w-full flex-col items-center space-y-5 px-0 py-0">
          <div className="text-base font-medium">
            <span className="text-base font-medium text-slate-600">
              Already Have An Account?{' '}
            </span>
            <Link
              href="/auth/login"
              className="text-base font-semibold text-indigo-800"
            >
              Login
            </Link>
          </div>
        </CardFooter>

        <CardFooter className="mt-5 flex w-full flex-col items-center space-y-5 px-0 py-0">
          <div className="text-xs font-medium">
            By signing up, you agree to our{' '}
            <Link
              href="/terms-and-conditions"
              className="text-indigo-800 underline"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-indigo-800 underline">
              {' '}
              Privacy Policy{' '}
            </Link>
            . This site is protected by reCAPTCHA and the{' '}
            <Link
              href="https://policies.google.com/privacy?hl=en-GB"
              className="text-indigo-800 underline"
            >
              Google Privacy Policy
            </Link>{' '}
            and
            <Link
              href="https://policies.google.com/terms?hl=en-GB"
              className="text-indigo-800 underline"
            >
              {' '}
              Terms of Service{' '}
            </Link>{' '}
            apply.
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
);

//USER DATA
interface User {
  userFirstname: string;
  userLastname: string;
  email: string;
  phone: string;
  password: string;
  userAffiliateRef: string;
}

//API RESPONSE
interface ApiResponse {
  messagex: any;
  statusx: string;
  successx: boolean;
  userx: User;
  // Add other properties as needed
}

////////////////////// MAIN FORM : SIGNUP //////////////////////
const SignupPageContainer: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoadingx, setIsLoadingx] = React.useState(true);

  const searchParams = useSearchParams();

  // Get affiliate reference from multiple sources
  const getAffiliateRef = React.useCallback(() => {
    // First, check URL parameters
    const urlAffRef = new URLSearchParams(searchParams).get('affRef');
    if (urlAffRef) {
      return urlAffRef;
    }

    //alert('AFFREF1: ' + urlAffRef);

    // Second, check stored affiliate reference (cookie/localStorage)
    const storedAffRef = getAffiliateReference();

    if (storedAffRef) {
      return storedAffRef;
    }

    //alert('AFFREF2: ' + storedAffRef);

    // Default fallback
    return 'NO_REF';
  }, [searchParams]);

  const userAffiliateRefx = getAffiliateRef();

  //alert('Affiliate Reference Used: ' + userAffiliateRefx);

  React.useEffect(() => {
    // Check if user data is not loaded
    if (!user?.userEmail) {
      setIsLoadingx(false);
      if (!user?.userEmail) {
        //do nothing
      }
    } else {
      router.push('/dashboard');
    }
  }, [user, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      userFirstname: '',
      userLastname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userAffiliateRef: userAffiliateRefx,
    },
  });

  // Update the affiliate reference if it changes
  React.useEffect(() => {
    const currentAffRef = getAffiliateRef();
    if (currentAffRef && currentAffRef !== form.getValues('userAffiliateRef')) {
      form.setValue('userAffiliateRef', currentAffRef);
    }
  }, [searchParams, form, getAffiliateRef]);

  const [message, setMessage] = React.useState('') as any;
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    console.log('Form data with affiliate ref:', data);

    const userFirstname = data.userFirstname;
    const userLastname = data.userLastname;
    const email = data.email;
    const phone = data.phone;
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    const userAffiliateRef = data.userAffiliateRef;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userFirstname,
          userLastname,
          email,
          phone,
          password,
          confirmPassword,
          userAffiliateRef,
        }),
      });
      const data: ApiResponse = await res.json();
      if (data.successx) {
        router.push('/auth/account-creation-success');
        setLoading(false);
      } else {
        setMessage(data.messagex.message1);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!user?.userEmail && (
        <SignupPage
          message={message}
          form={form}
          isPasswordVisible={isPasswordVisible}
          isLoading={isLoading}
          togglePasswordVisibility={togglePasswordVisibility}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default SignupPageContainer;
