'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/layout/logo';

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      router.push('/auth/login');
    } catch {
      alert('Reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input type="password" placeholder="New Password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" className="w-full" disabled={loading}>Reset Password</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center">New Password</h1>
          <Suspense><ResetForm /></Suspense>
          <p className="mt-4 text-center text-sm"><Link href="/auth/login" className="text-brand hover:underline">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
}