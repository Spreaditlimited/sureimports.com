'use client';

import MessageHistory from '@/components/dashboard/message/message-table';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function MessageBox() {
  const router = useRouter();
  return (
    <div className="si-workspace-plain">
      <div className="mb-6 flex justify-between gap-4 max-sm:flex-col">
        <h1>Messages</h1>
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
