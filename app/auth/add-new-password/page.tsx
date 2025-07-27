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

const formSchema = z
  .object({
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
  label: string;
  type: string;
  placeholder: string;
  iconSrc: string;
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
            {type === 'password' && (
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
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

interface AddNewPasswordPageProps {
  form: UseFormReturn<FormValues>;
  isPasswordVisible: boolean;
  isLoading: boolean;
  togglePasswordVisibility: () => void;
  onSubmit: (data: FormValues) => void;
}

const AddNewPasswordPage: React.FC<AddNewPasswordPageProps> = ({
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
              src="/images/logo.png"
              alt="Logo"
              width={144}
              height={48}
              className="mb-4 h-12 w-36 self-center"
            />
          </Link>
          <div className="text-sm font-bold text-indigo-800">
            Don&apos;t worry! We Got You
          </div>
          <h1 className="mt-1.5 text-3xl font-extrabold text-slate-800">
            Add New Password
          </h1>
        </CardHeader>
        <CardContent className="mb-0 mt-10 px-0 py-0">
          <Form {...form}>
            <form
              className="flex flex-col space-y-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                name="password"
                control={form.control}
                label="Password"
                type="password"
                placeholder="************"
                iconSrc="/icons/password.svg"
                isPasswordVisible={isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
              />
              <InputField
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
                type="password"
                placeholder="************"
                iconSrc="/icons/password.svg"
                isPasswordVisible={isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
              />
              <Button
                type="submit"
                className="mt-8 h-14 py-3.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AddNewPasswordPageContainer: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const [isPasswordVisible, setPasswordVisible] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading(false);
  };

  return (
    <AddNewPasswordPage
      form={form}
      isPasswordVisible={isPasswordVisible}
      isLoading={isLoading}
      togglePasswordVisibility={togglePasswordVisibility}
      onSubmit={onSubmit}
    />
  );
};

export default AddNewPasswordPageContainer;
