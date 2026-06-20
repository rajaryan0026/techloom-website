'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data.data,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-surface-gray">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Verified</th>
              <th className="pb-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: { id: string; name: string; email: string; role: string; emailVerified: boolean; createdAt: string }) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="py-3 pr-4 font-medium">{u.name}</td>
                <td className="py-3 pr-4 text-surface-gray">{u.email}</td>
                <td className="py-3 pr-4"><span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{u.role}</span></td>
                <td className="py-3 pr-4">{u.emailVerified ? '✓' : '—'}</td>
                <td className="py-3 text-surface-gray">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}