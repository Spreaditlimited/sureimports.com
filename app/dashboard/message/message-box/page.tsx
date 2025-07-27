'use client';

import MessageHistory from '@/components/dashboard/message/message-table';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function MessageBox() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800">
      <div className="flex justify-between px-4 pt-[25px] max-sm:flex-col">
        <div className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4">
          Message Box
        </div>
        <Button
          className="font-medium xl:h-[49px] xl:w-[255px]"
          onClick={() => {
            router.push('/dashboard/message');
          }}
        >
          Compose Message
        </Button>
      </div>
      <MessageHistory />
    </div>
  );
}

export default MessageBox;
