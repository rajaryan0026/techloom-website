'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch { /* still show sent for security */ setSent(true); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          {sent ? (
            <p className="mt-4 text-center text-surface-gray">If an account exists, a reset link has been sent.</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" className="w-full" disabled={loading}>Send Reset Link</Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm"><Link href="/auth/login" className="text-brand hover:underline">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}