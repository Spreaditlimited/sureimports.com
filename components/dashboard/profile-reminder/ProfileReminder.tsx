'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowRight, MessageCircle, UserRound } from 'lucide-react';

export default function ProfileReminder() {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user?.pidUser) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `/api/profile-update-check?pidUser=${encodeURIComponent(user.pidUser)}`,
        );
        if (!response.ok) return;

        const data = (await response.json()) as { phone?: string | null } | null;
        setShowPopup(!data?.phone);
      } catch (error) {
        console.error('Unable to check profile completion:', error);
      }
    };

    fetchUser();
  }, [user?.pidUser]);

  if (!showPopup || !user) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden rounded-[32px] border-0 bg-white p-0 shadow-2xl dark:bg-slate-900 sm:max-w-md">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                <UserRound className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              Update Your Profile
            </DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed text-slate-500 dark:text-slate-400">
              Add your WhatsApp number so our support team can reach you when
              your orders need attention.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/10">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
              <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Stay informed
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                A complete profile helps us provide faster updates and better
                support throughout your import process.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => setShowPopup(false)}
              className="h-12 rounded-xl border-slate-200 px-5 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => router.push('/dashboard/profile-update')}
              className="h-12 rounded-xl bg-indigo-800 px-5 font-bold text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-900 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              Update Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
