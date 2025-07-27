'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z
  .object({
    userFirstname: z.string().min(1, {
      message: 'Firstname is required.',
    }),
    userLastname: z.string().min(1, {
      message: 'Lastname is required.',
    }),
    email: z.string().email({
      message: 'Invalid email address.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

interface InputFieldProps {
  name: keyof FormValues;
  control: Control<FormValues>;
  label?: string;
  type: string;
  placeholder: string;
  iconSrc: string;
  description?: string;
  password?: boolean;
  isPasswordVisible?: boolean;
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
              src={iconSrc}
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
              type={isPasswordVisible ? 'text' : type}
              placeholder={placeholder}
              aria-label={label}
              className="mt-2 flex h-[60px] items-center rounded-[10px] border-none px-[50px]"
              {...field}
              value={
                typeof field.value === 'boolean'
                  ? (field.value as boolean).toString()
                  : field.value
              }
            />
          </div>
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

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
  <Card className="relative mb-5 w-full rounded-3xl bg-white p-5 shadow-2xl max-lg:w-full sm:p-10 lg:mb-10 lg:mt-24">
    <CardHeader className="mt-0 p-0 text-center">
      <h1 className="mt-1.5 text-[28px] font-bold text-slate-800">
        Join over 30,000 merchants today
      </h1>
    </CardHeader>

    <CardContent className="mb-0 mt-5 px-0 py-0">
      <Form {...form}>
        <form
          className="flex flex-col space-y-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

      {/* <div className="flex h-[20px] w-full items-center text-slate-600">
        <div className="w-full">
          <Separator className="" />
        </div>
        <div className="mx-4 w-6 text-base font-normal text-slate-600">OR</div>
        <div className="w-full">
          <Separator className="" />
        </div>
      </div> */}

      {/* <Button className="flex h-14 w-full items-center rounded-xl bg-slate-100 py-3.5 hover:bg-slate-200">
        <Image
          loading="lazy"
          src="/icons/google.svg"
          alt="Google icon"
          width={24}
          height={24}
          className="mr-2 h-6 w-6"
        />
        <span className="text-base font-semibold text-black">
          Sign Up with Google
        </span>
      </Button> */}
    </CardFooter>
  </Card>
);

//USER DATA
interface User {
  userFirstname: string;
  userLastname: string;
  email: string;
  password: string;
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [message, setMessage] = React.useState('');
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    console.log(data);
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const userFirstname = data.userFirstname;
    const userLastname = data.userFirstname;
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmPassword;

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
          password,
          confirmPassword,
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
      //setError(error.message);
    } finally {
      //setIsLoading(false);
      //alert('Taking Final Action');
      setLoading(false);
    }
    //router.push('/auth/account-creation-success');
    //alert(data.email);
  };

  return (
    <SignupPage
      message={message}
      form={form}
      isPasswordVisible={isPasswordVisible}
      isLoading={isLoading}
      togglePasswordVisibility={togglePasswordVisibility}
      onSubmit={onSubmit}
    />
  );
};

export default SignupPageContainer;
