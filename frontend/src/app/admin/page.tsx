'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => (await api.get('/admin/analytics')).data.data,
  });

  if (isLoading) return <p>Loading analytics...</p>;

  const chartData = analytics?.leadsByStatus?.map((l: { status: string; _count: number }) => ({
    name: l.status,
    count: l._count,
  })) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Analytics</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: 'Total Users', value: analytics?.totalUsers },
          { label: 'Total Leads', value: analytics?.totalLeads },
          { label: 'Total Projects', value: analytics?.totalProjects },
          { label: 'Revenue', value: `$${(analytics?.totalRevenue || 0).toLocaleString()}` },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader><CardTitle className="text-sm text-surface-gray">{s.label}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-brand">{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Lead Pipeline</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#71717A" fontSize={12} />
              <YAxis stroke="#71717A" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1F1F1F', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Blog Analytics</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{analytics?.totalBlogViews?.toLocaleString()} <span className="text-sm font-normal text-surface-gray">total views</span></p>
        </CardContent>
      </Card>
    </div>
  );
}