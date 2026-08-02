'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    toast.loading('Subscribing...');
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, service: 'SUREIMPORTS' }),
      });
      const data = await response.json();

      if (data.statusx === 'SUCCESS') {
        toast.success(data.messagex || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.messagex || 'Subscription failed.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="mb-6 flex gap-2">
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="h-10 border-slate-800 bg-slate-900 text-sm text-white"
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 border-0 bg-brand-orange-500 text-white hover:bg-brand-orange-600"
      >
        Subscribe
      </Button>
    </form>
  );
}
