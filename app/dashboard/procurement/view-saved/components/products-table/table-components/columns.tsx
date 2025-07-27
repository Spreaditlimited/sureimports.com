'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import Link from 'next/link';

export type Products = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  unitWeight: number;
};

type TableMeta = {
  onDelete: (id: number) => void;
};

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: 'id',
    header: 'SR No.',
    cell: ({ row }) => <div>#{row.original.id}</div>,
  },
  {
    accessorKey: 'product.name',
    header: 'PRODUCT NAME',
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="text-base font-normal text-slate-800 dark:text-slate-200">
                <Link href={`/dashboard/1/${row.original.id}/view-product`}>
                  {row.original.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'productInfo',
    header: 'PRODUCT INFO',
    cell: () => {
      return <div>Red colour - size 45, Black colour - size 44</div>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'QUANTITY',
    cell: ({ row }) => {
      return <div>{row.original.quantity} Pieces</div>;
    },
  },
  {
    accessorKey: 'unitPrice',
    header: 'UNIT PRICE',
    cell: ({ row }) => {
      return <div className="">₦{row.original.unitPrice}</div>;
    },
  },
  {
    accessorKey: 'unitWeight',
    header: 'UNIT WEIGHT',
    cell: ({ row }) => {
      return <div>{row.original.unitWeight} Kg</div>;
    },
  },
  {
    id: 'totalPrice',
    accessorKey: 'TOTAL PRICE',
    cell: ({ row }) => {
      const totalPrice = row.original.unitPrice * row.original.quantity;

      return <div>₦{totalPrice}</div>;
    },
  },
  {
    id: 'actions',
    accessorKey: 'ACTIONS',
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta;
      const onDelete = meta?.onDelete;

      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/${row.original.id}/edit-product`} passHref>
            <Button className="item-ceneter flex h-11 w-11 justify-center rounded-full bg-blue-100 p-0 font-normal hover:bg-blue-200">
              <Image
                src="/icons/edit.svg"
                alt="delete"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </Button>
          </Link>

          <div className="hidden">{row.original.id}</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="item-ceneter flex h-11 w-11 justify-center rounded-full bg-red-100 p-0 font-normal hover:bg-red-200">
                <Image
                  src="/icons/delete.svg"
                  alt="delete"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
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
              <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-slate-200">
                Are you sure you want to delete?
              </div>
              <div className="flex w-80 text-center text-sm text-slate-600">
                This will delete this record and you cannot recover it.
              </div>
              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]">
                    No! keep it
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => onDelete(row.original.id)}
                    className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                  >
                    Yes! Remove
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
