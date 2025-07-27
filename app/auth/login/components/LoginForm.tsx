'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';

////////////////////// ZOD DATA SCHEMA //////////////////////
const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(6, {
    message: '',
  }),
  keepMeSignedIn: z.boolean().optional(),
});
////////////////////// INPUT FIELD COMPONENTS //////////////////////

type FormValues = z.infer<typeof formSchema>;

interface InputFieldProps {
  name: keyof FormValues;
  control: Control<FormValues>;
  label: string;
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
                  ? field.value.toString()
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

////////////////////// FORM COMPONENT //////////////////////
interface LoginPageProps {
  message: string;
  form: UseFormReturn<FormValues>;
  isPasswordVisible: boolean;
  isLoading: boolean;
  togglePasswordVisibility: () => void;
  onSubmit: (data: FormValues) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({
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
          <div className="text-sm font-bold text-indigo-800">Welcome Back!</div>
          <h1 className="mt-1.5 text-3xl font-extrabold text-slate-800">
            Login with your email
          </h1>
        </CardHeader>
        <CardContent className="mb-0 mt-10 px-0 py-0">
          <Form {...form}>
            <form
              className="flex flex-col space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                name="email"
                control={form.control}
                label="Email/Username"
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
                description=""
              />

              <FormField
                control={form.control}
                name="keepMeSignedIn"
                render={({ field }) => (
                  <FormItem className="mt-4 flex items-center justify-between text-base font-medium text-slate-600">
                    <Label className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-slate-600 sm:text-base">
                        Keep me signed in
                      </span>
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-indigo-800 sm:text-base"
                    >
                      Forgot Password?
                    </Link>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-8 h-14 py-3.5"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
              </Button>
              {message && <p className="text-red-600">{message}</p>}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="mt-5 flex w-full flex-col items-center space-y-5 px-0 py-0">
          <div className="text-base font-medium">
            <span className="text-base font-medium text-slate-600">
              Don’t have an account?{' '}
            </span>
            <Link
              href="/auth/signup"
              className="text-base font-semibold text-indigo-800"
            >
              Register Now
            </Link>
          </div>

          {/* <div className="flex h-[20px] w-full items-center text-slate-600">
            <div className="w-full">
              <Separator className="" />
            </div>
            <div className="mx-4 w-6 text-base font-normal text-slate-600">
              OR
            </div>
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
              Login with Google
            </span>
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  </div>
);

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
  messagex: any;
  statusx: string;
  successx: boolean;
  userx: User;
  // Add other properties as needed
}

////////////////////// MAIN FORM : LOGIN //////////////////////
const LoginPageContainer: React.FC = () => {
  useEffect;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', keepMeSignedIn: false },
  });

  const { user, login } = useAuth();
  const router = useRouter();
  const [isLoading, setLoading] = React.useState(false);
  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  //const [userEmail, setUserEmail] = useState('');
  //const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  // SUBMIT FORM
  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      setLoading(true);
      await login(data.email, data.password);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }

    // try {
    //   const res = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });

    //   const response: ApiResponse = await res.json();
    //   //alert('==================ddd==================='+response);
    //   if (response.statusx === 'RESET') {
    //     router.push('/auth/welcome-reset-password?email=' + data.email);
    //   } else if (response.statusx === 'NOT_VERIFIED') {
    //     router.push('/auth/account-not-activated/?email=' + data.email);
    //   } else if (response.successx) {
    //     login(response.userx);
    //   } else {
    //     setMessage(response.messagex?.message1 || 'Login failed');
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setMessage('An error occurred');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <>
      <LoginPage
        message={error}
        form={form}
        isPasswordVisible={isPasswordVisible}
        isLoading={isLoading}
        togglePasswordVisibility={togglePasswordVisibility}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default LoginPageContainer;
