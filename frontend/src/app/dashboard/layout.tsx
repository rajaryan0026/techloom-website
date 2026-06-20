'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center pt-16">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen pt-16">
      <DashboardSidebar />
      <div className="flex-1 p-6 lg:p-8">{children}</div>
    </div>
  );
}