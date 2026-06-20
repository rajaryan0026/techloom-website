'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      setDone(true);
    } catch {
      alert('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 text-center">
      <h3 className="text-xl font-semibold">Stay Updated</h3>
      <p className="mt-2 text-sm text-surface-gray">Get the latest AI insights delivered to your inbox.</p>
      {done ? (
        <p className="mt-4 text-brand font-medium">You&apos;re subscribed!</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <Input type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" disabled={loading}>Subscribe</Button>
        </form>
      )}
    </div>
  );
}