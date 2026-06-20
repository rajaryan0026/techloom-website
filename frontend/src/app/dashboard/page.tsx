'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: projects } = useQuery({
    queryKey: ['my-projects'],
    queryFn: async () => (await api.get('/users/me/projects')).data.data as Project[],
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/users/me/notifications')).data.data,
  });

  const unread = notifications?.filter((n: { read: boolean }) => !n.read).length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-surface-gray mt-1">Here&apos;s an overview of your account</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Projects</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-brand">{projects?.filter((p) => p.status !== 'COMPLETED').length || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Total Projects</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{projects?.length || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{unread} <span className="text-sm font-normal text-surface-gray">unread</span></p></CardContent>
        </Card>
      </div>
    </div>
  );
}