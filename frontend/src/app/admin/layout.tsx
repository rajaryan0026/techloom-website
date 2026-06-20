'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/auth/login');
      else if (user.role !== 'ADMIN' && user.role !== 'EDITOR') router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="flex min-h-screen items-center justify-center pt-16">Loading...</div>;

  return (
    <div className="flex min-h-screen pt-16">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">{children}</div>
    </div>
  );
}