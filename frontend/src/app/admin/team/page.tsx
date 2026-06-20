'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { TeamMember } from '@/types';

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  avatar: '',
  linkedin: '',
  order: 0,
};

export default function AdminTeamPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: team, isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => (await api.get('/admin/team')).data.data as TeamMember[],
  });

  const saveMember = useMutation({
    mutationFn: (data: typeof emptyForm & { id?: string }) =>
      data.id
        ? api.patch(`/admin/team/${data.id}`, data)
        : api.post('/admin/team', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      resetForm();
    },
  });

  const deleteMember = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/team/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-team'] }),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(m: TeamMember) {
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || '',
      avatar: m.avatar || '',
      linkedin: m.linkedin || '',
      order: m.order,
    });
    setEditingId(m.id);
    setShowForm(true);
  }

  async function handleAvatarUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, avatar: data.data.url }));
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveMember.mutate(editingId ? { ...form, id: editingId } : form);
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Team Members</h1>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-premium mb-8 space-y-4 rounded-2xl p-6">
          <h2 className="font-semibold">{editingId ? 'Edit Team Member' : 'New Team Member'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Role *</label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Display Order</label>
              <Input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">LinkedIn URL</label>
              <Input
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-surface-gray">Bio</label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-surface-gray">Avatar URL</label>
            <div className="flex gap-2">
              <Input
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://..."
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {form.avatar && (
              <img src={form.avatar} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover" />
            )}
          </div>
          <Button type="submit" disabled={saveMember.isPending}>
            {saveMember.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {team?.map((m) => (
          <div key={m.id} className="glass-premium flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {m.avatar ? (
                <img src={m.avatar} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
                  {m.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-medium">{m.name}</h3>
                <p className="text-xs text-brand">{m.role}</p>
                {m.bio && <p className="mt-1 text-xs text-surface-gray line-clamp-1">{m.bio}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-gray">Order: {m.order}</span>
              <Button size="sm" variant="outline" onClick={() => startEdit(m)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteMember.mutate(m.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {!team?.length && <p className="text-surface-gray">No team members yet.</p>}
      </div>
    </div>
  );
}