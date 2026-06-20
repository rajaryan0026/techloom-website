'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', clientId: '', status: 'PENDING' });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => (await api.get('/admin/projects')).data.data,
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data.data,
  });

  const createProject = useMutation({
    mutationFn: (data: typeof form) => api.post('/admin/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setShowForm(false);
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, status, progress }: { id: string; status?: string; progress?: number }) =>
      api.patch(`/admin/projects/${id}`, { status, progress }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>Create Project</Button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="w-full rounded-xl bg-white/5 px-4 py-2 text-sm border border-white/10" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            <option value="">Select Client</option>
            {users?.filter((u: { role: string }) => u.role === 'CLIENT').map((u: { id: string; name: string }) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <Button onClick={() => createProject.mutate(form)} disabled={createProject.isPending}>Create</Button>
        </div>
      )}

      <div className="space-y-4">
        {projects?.map((p: { id: string; title: string; status: string; progress: number; client: { name: string } }) => (
          <div key={p.id} className="glass rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-xs text-surface-gray">Client: {p.client?.name}</p>
              </div>
              <select
                value={p.status}
                onChange={(e) => updateProject.mutate({ id: p.id, status: e.target.value })}
                className="rounded-lg bg-white/5 px-2 py-1 text-xs border border-white/10"
              >
                {['PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ON_HOLD'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brand" style={{ width: `${p.progress}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={p.progress}
                onChange={(e) => updateProject.mutate({ id: p.id, progress: Number(e.target.value) })}
                className="w-24"
              />
            </div>
          </div>
        ))}
        {!projects?.length && <p className="text-surface-gray">No projects yet.</p>}
      </div>
    </div>
  );
}