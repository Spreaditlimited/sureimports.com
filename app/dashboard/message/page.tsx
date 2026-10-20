'use client';

import MessageForm from '@/components/dashboard/message/message-form';
import React from 'react';
import { useRouter } from 'next/navigation';

function Message() {
  const router = useRouter();
  return (
    <div className="si-workspace-plain">
      <button
        type="button"
        className="mb-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        onClick={() => {
          router.push(`/dashboard/message/message-box`);
        }}
      >
        ← Message history
      </button>
      <h1 className="mb-6">Compose a message</h1>
      <div className="rounded-xl bg-white dark:bg-[#161629]">
        <MessageForm />
      </div>
    </div>
  );
}

export default Message;
