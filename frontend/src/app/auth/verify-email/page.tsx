'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Logo } from '@/components/layout/logo';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <p className="mt-4 text-center text-surface-gray">
      {status === 'loading' && 'Verifying your email...'}
      {status === 'success' && 'Email verified successfully!'}
      {status === 'error' && 'Verification failed. Link may be expired.'}
    </p>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 text-center">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">Email Verification</h1>
        <Suspense><VerifyContent /></Suspense>
        <Link href="/auth/login" className="mt-6 inline-block text-brand hover:underline">Go to Login</Link>
      </div>
    </div>
  );
}