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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input-with-dark-mode';

const formSchema = z.object({
  bankname: z
    .string()
    .min(2, {
      message: 'Name is required',
    })
    .max(500),
  depositerName: z.string().min(2, { message: 'Depositor Name is required' }),
});

function BankPaymentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankname: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="p-[25px]">
      <div className="pt-[25px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-[25px]">
              <FormField
                control={form.control}
                name="bankname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Bank*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="col-span-6">
                        <div className="item-center relative flex">
                          <Image
                            src="/icons/profile-update/bank.svg"
                            alt="search"
                            width={20}
                            height={20}
                            className="absolute m-2 lg:m-5"
                          />
                          <SelectTrigger className="bg-slate-100 pl-12 max-sm:w-[340px] lg:h-[60px] lg:w-full">
                            <SelectValue placeholder="Select bank used" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Access Bank">Access Bank</SelectItem>
                        <SelectItem value="GT Bank">GT Bank</SelectItem>
                        <SelectItem value="Guaranty Trust Bank Ltd">
                          Guaranty Trust Bank Ltd
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depositerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Depositor's Full Name.*`}</FormLabel>
                    <FormControl className="col-span-6">
                      <div className="item-center relative flex">
                        <Input
                          className="mb-[16px] mt-[10px] bg-slate-100 max-sm:w-[340px] lg:h-[60px]"
                          placeholder="Provide depositor full name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="col-span-8 flex justify-start" />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-sm font-normal text-slate-600 dark:text-slate-300 md:w-[700px]">
              Please, make a bank payment to any of the accounts above before
              submitting. Please Do NOT submit the same payment twice.
            </div>
            <div className="mt-[25px] flex md:justify-end">
              <Button
                type="submit"
                className="flex h-[49px] w-[300px] gap-[10px] rounded-xl bg-indigo-800 px-[25px] py-[15px] font-medium"
              >
                <Image
                  src="/icons/profile-update/bank-white.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                />
                Submit Bank Deposit details
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default BankPaymentForm;
