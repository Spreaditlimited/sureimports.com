'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input-with-dark-mode';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

function UpdatePasswordForm() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.userEmail,
    },
  });

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

  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    //const router = useRouter();

    console.log(values);
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    const userEmail = values.email;

    //MAKE REQUEST ATTEMPT
    try {
      //MAKE REQUEST
      toast.info('Sending Password Reset Link . . .');
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
        toast.success('Password Reset Link Sent!');
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
    <div className="p-[25px]">
      <div className="border-b border-gray-200 pb-[20px] text-xl font-bold text-slate-800 dark:border-gray-700 dark:text-white">
        Reset Password
      </div>
      <div className="pt-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 dark:text-gray-200">
                    Email address
                  </FormLabel>
                  <FormControl className="col-span-6">
                    <div className="item-center relative flex">
                      {/* <Image
                        src="/icons/add-product/email.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-5 lg:m-5 lg:mt-[30px]"
                      /> */}
                      <Mail
                        className="absolute m-5 text-gray-400 lg:m-5 lg:mt-[30px]"
                        style={{ width: 20, height: 20 }}
                      />
                      <Input
                        className="mb-[16px] mt-[10px] bg-slate-100 pl-12 dark:bg-slate-800 dark:text-white max-sm:w-full lg:h-[60px]"
                        placeholder="Admin@spreaditglobal.com"
                        {...field}
                        disabled
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-slate-600 dark:text-gray-400">
                    A Password Reset Link will be sent to your mail
                    <br />
                    {message && <p className="text-blue-600">{message}</p>}
                  </FormDescription>
                  <FormMessage className="col-span-8 flex justify-start text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex md:justify-end">
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdatePasswordForm;
