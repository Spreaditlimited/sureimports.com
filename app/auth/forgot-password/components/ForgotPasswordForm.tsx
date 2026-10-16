'use client';
import AuthFrame from '@/components/auth-ui/AuthFrame';
import AuthHeading from '@/components/auth-ui/AuthHeading';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

////////////////////// ZOD FORM SCHEMA //////////////////////
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email('Invalid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

interface ApiResponse {
  responsex: {
    status: string;
    message: string;
  };
  successx: boolean;
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/password-reset-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: data.email }),
      });

      const responseData: ApiResponse = await res.json();

      if (responseData.responsex?.status === 'PASSWORD_RESET_LINK_SENT') {
        setIsSuccess(true);
        toast.success('Password reset link sent to your email.');
      } else if (
        responseData.responsex?.status === 'INVALID_EMAIL' ||
        responseData.responsex?.status === 'NOT_REGISTERED'
      ) {
        toast.error(
          responseData.responsex.message || 'Email not found in our system.',
        );
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      toast.error('A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFrame>
      <AuthHeading
        title="Forgot your password?"
        description="Enter your registered email address and we’ll send you a reset link."
      />{' '}
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            Check your email
          </h3>
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
            We've sent a password reset link to <br />
            <span className="font-semibold text-slate-900 dark:text-white">
              {form.getValues('email')}
            </span>
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="h-14 w-full rounded-xl bg-indigo-800 text-base font-bold text-white shadow-xl shadow-indigo-900/20 transition-all hover:bg-indigo-900 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Return to Login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Registered Email
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="h-14 rounded-xl border-slate-200 bg-slate-50 pl-12 text-sm focus-visible:ring-brand-orange-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold text-rose-500" />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 w-full rounded-xl border-0 bg-brand-orange-500 text-base font-bold text-white shadow-xl shadow-brand-orange-500/20 transition-all hover:bg-brand-orange-600 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending
                    Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/auth/login')}
                disabled={isLoading}
                className="h-14 w-full rounded-xl border-slate-200 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Button>
            </div>
          </form>
        </Form>
      )}
    </AuthFrame>
  );
}
