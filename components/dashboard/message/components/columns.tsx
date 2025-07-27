'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Messages = {
  id: string;
  amount: number;
  image: string;
  status: 'read' | 'unread';
  email: string;
};

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);
  return format(date, "HH:mm:ss'pm' | dd MMMM | yyyy");
}

export const columns: ColumnDef<Messages>[] = [
  {
    accessorKey: 'status',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      return (
        <div className="text-base font-normal text-slate-600 dark:text-slate-300">
          <div className="flex">
            <div className="mr-3 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-slate-100">
              <Image
                src={row.original.image}
                alt="user"
                width={20}
                height={20}
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div>{row.original.email}</div>
              <div>
                <div className="text-sm text-slate-900 dark:text-slate-400">
                  Successful Refunds Transfer
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-500">
                  ORDER ID: NA
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const createdAt = '2023-06-01T14:24:29Z';
      const formattedDate = formatCreatedAt(createdAt);

      return (
        <div className="flex flex-col items-end gap-[22px] text-base font-normal text-slate-600">
          <div>{formattedDate}</div>
          <div className="flex gap-3">
            {row.original.status == 'unread' ? (
              <Button className="h-[29px] w-[72px] rounded-md bg-red-400 px-3 py-1.5 text-sm font-normal">
                Unread
              </Button>
            ) : (
              ''
            )}
            <Button className="h-[29px] w-[58px] rounded-md bg-slate-400 px-3 py-1.5 text-sm font-normal">
              Read
            </Button>
          </div>
        </div>
      );
    },
  },
];
