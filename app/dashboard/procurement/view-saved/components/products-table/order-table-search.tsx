'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input-with-dark-mode';

const formSchema = z.object({
  search: z.string().min(2, {
    message: 'search',
  }),
  entries: z.number().min(1),
});

const orders = 10;

export default function SearchPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
      entries: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
        <FormField
          control={form.control}
          name="entries"
          render={({ field }) => (
            <FormItem className="mb-2 h-10 max-w-14 items-center justify-center gap-3">
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`${orders}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto">
                  <SelectGroup>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  {/* <Image
                    loading="lazy"
                    src="/icons/search.svg"
                    alt=""
                    width={19}
                    height={19}
                    className="absolute z-10 m-4 h-5 shrink-0"
                  /> */}
                  <Input
                    placeholder={`Search here...`}
                    {...field}
                    className="h-10 w-[301px] placeholder:text-[13px] max-md:w-36"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
