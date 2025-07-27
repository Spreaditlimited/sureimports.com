'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input-with-dark-mode';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  title: z.string().min(2, {
    message: 'Title is required',
  }),
  message: z.string().min(2, {
    message: 'Message is required',
  }),
});

function MessageForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="pt-[25px]">
      <div className="mb-[25px] border-b pb-[20px] text-xl font-bold text-slate-800 dark:text-slate-200">
        <div className="ml-[25px]">Compose message</div>
      </div>
      <div className="ml-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl className="col-span-6">
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/add-product/email.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-5 lg:m-5 lg:mt-[30px]"
                      />
                      <Input
                        className="mb-[16px] mr-[25px] mt-[10px] bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px]"
                        placeholder="Admin@spreaditglobal.com"
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Title</FormLabel>
                  <FormControl className="col-span-6">
                    <div className="item-center relative flex">
                      <Image
                        src="/icons/profile-update/message.svg"
                        alt="search"
                        width={20}
                        height={20}
                        className="absolute m-5 lg:m-5 lg:mt-[30px]"
                      />
                      <Input
                        className="mb-[16px] mr-[25px] mt-[10px] bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px]"
                        placeholder="Enter Supplier name"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="col-span-8 flex justify-start" />
                </FormItem>
              )}
            />
            <div className="flex flex-col pr-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Info</FormLabel>
                    <FormControl>
                      <div className="item-center relative flex">
                        <Image
                          src="/icons/profile-update/message.svg"
                          alt="search"
                          width={20}
                          height={20}
                          className="absolute m-5 lg:m-5"
                        />
                        <Textarea
                          className="mt-[10px] bg-slate-100 pl-12 max-sm:w-[340px] lg:h-32 lg:w-full"
                          placeholder="Type your message here"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:justify-end">
              <Button
                type="submit"
                className="mb-[25px] mt-[25px] flex h-[49px] w-[205px] gap-[10px] rounded-xl bg-indigo-800 px-[30px] py-[15px] font-medium sm:mx-[25px]"
              >
                Send Message
                <Image
                  src="/icons/arrow-right.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default MessageForm;
