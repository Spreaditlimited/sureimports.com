'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';

//zod form schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Registered Email is required.',
    })
    .email('Invalid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

interface InputFieldProps {
  name: keyof FormValues;
  control: Control<FormValues>;
  label: string;
  type: string;
  placeholder: string;
  iconSrc: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  label,
  type,
  placeholder,
  iconSrc,
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

            <Input
              type={type}
              placeholder={placeholder}
              aria-label={label}
              className="mt-2 flex h-[60px] items-center rounded-[10px] border-none px-[50px]"
              {...field}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface ForgotPasswordPageProps {
  message: string;
  form: UseFormReturn<FormValues>;
  isLoading: boolean;
  onSubmit: (data: FormValues) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  message,
  form,
  isLoading,
  onSubmit,
}) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-white">
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
          <div className="text-sm font-bold text-indigo-800">Oh No</div>
          <h1 className="mt-1.5 text-3xl font-extrabold text-slate-800">
            Forgot Password
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
                label="Registered Email"
                type="email"
                placeholder="Enter Your Email or Username"
                iconSrc="/icons/mail.svg"
              />
              <Button
                type="submit"
                className="mt-8 h-14 py-3.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Send Password Reset Link
                    <Image
                      loading="lazy"
                      src="/icons/arrow-right.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="ml-2 h-5 w-5"
                    />
                  </>
                )}
              </Button>

              <Link href={'/auth/login'}>
                <Button className="mt-8 h-14 bg-slate-300 py-3.5 hover:bg-slate-400">
                  Back to Login
                </Button>
              </Link>

              <br />
              {message && <p className="text-blue-600">{message}</p>}
            </form>
          </Form>
        </CardContent>
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
  responsex: any;
  successx: boolean;
  userx: User;
  // Add other properties as needed
}

//MAIN FORM
const ForgotPasswordPageContainer: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    console.log(data);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const userEmail = data.email;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      const res = await fetch('/api/auth/password-reset-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });

      // GET & PROCESS RESPONSE FROM API
      const data: ApiResponse = await res.json();

      if (data.responsex.status == 'INVALID_EMAIL') {
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }

      if (data.responsex.status == 'NOT_REGISTERED') {
        //router.push('/auth/login');
        setMessage(data.responsex.message);
        setLoading(false);
      }

      if (data.responsex.status == 'PASSWORD_RESET_LINK_SENT') {
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

  return (
    <ForgotPasswordPage
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      message={message}
    />
  );
};

export default ForgotPasswordPageContainer;
