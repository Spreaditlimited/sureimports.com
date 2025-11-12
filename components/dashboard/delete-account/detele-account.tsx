'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input-with-dark-mode';
import { useAuth } from '@/app/context/AuthContext';

const formSchema = z.object({
  delete: z.string(),
  userEmail: z.string(),
  pidUser: z.string(),
});

function DeleteAccountForm() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delete: '',
      userEmail: user?.userEmail,
      pidUser: user?.pidUser,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const [isLoading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const [pidUser, setPidUser] = useState(user?.pidUser);
  const [userEmail, setUserEmail] = useState(user?.userEmail);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

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

  const Logoutx = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('../auth/login');
  };

  const handleDelete = async () => {
    console.log(pidUser);
    const formData = new FormData() as any;
    formData.append('pidUser', pidUser);
    formData.append('userEmail', userEmail);

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Deleting Account details. . .');
      //MAKE REQUEST
      const res = await fetch('/api/delete-account', {
        method: 'POST',
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
        Logoutx();
        router.push('/auth/login');
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

    logout();
  };

  // const handleDelete = () => {
  //   console.log('deleted');
  //   alert(values.delete);
  //   //router.push('/auth/login');
  //   setIsOpen({ isOpen: false });
  // };

  const onKeep = () => {
    console.log('kept');
    setIsOpen({ isOpen: false });
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'delete') {
        setIsDeleteEnabled(value.delete === 'DELETE ACCOUNT');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="p-[25px]">
      <div className="border-b pb-[20px] text-xl font-bold text-slate-800 dark:text-white">
        Delete Account
      </div>
      <div className="pt-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="delete"
              render={({ field }) => (
                <FormItem>
                  <FormDescription className="flex flex-col gap-4">
                    <div>
                      <span className="text-red-500">WARNING</span>
                      <span>
                        {' '}
                        :Deleting your account removes your access to SureImports
                        account and all the information in your account. This
                        action is irreversible.{' '}
                      </span>
                    </div>
                    <div>
                      You will be signed out of the system and will not be able
                      to sign in again
                    </div>
                    <div>Please type DELETE ACCOUNT to confirm.</div>
                  </FormDescription>
                  <FormControl className="col-span-6">
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/delete-black.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-5 lg:m-5 lg:mt-[30px]"
                      />
                      <Input
                        className="mb-[16px] mt-[10px] bg-slate-100 pl-12 focus-visible:ring-red-500 max-sm:w-[340px] lg:h-[60px]"
                        placeholder="Type DELETE ACCOUNT here"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="col-span-8 flex justify-start" />
                </FormItem>
              )}
            />
            <div className="flex md:justify-end">
              <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    className="mt-[25px] flex h-[49px] gap-[10px] font-medium"
                    disabled={!isDeleteEnabled}
                    variant="destructive"
                  >
                    <Image
                      src="/icons/delete-white.svg"
                      alt="delete"
                      width={20}
                      height={20}
                      className="cursor-pointer fill-white text-white"
                    />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex max-w-[396px] flex-col items-center justify-center overflow-auto rounded-[20px] py-[30px] dark:bg-[#161629]">
                  <Image
                    src="/icons/deletewarning.svg"
                    alt="delete"
                    width={100}
                    height={100}
                    className="cursor-pointer"
                  />
                  <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-slate-300">
                    Are you sure you want to delete this account?
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={onKeep}
                      className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]"
                    >
                      No! keep it
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                    >
                      Delete Account
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default DeleteAccountForm;
