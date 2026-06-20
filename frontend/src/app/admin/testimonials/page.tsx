'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Testimonial } from '@/types';

const emptyForm = {
  name: '',
  company: '',
  role: '',
  quote: '',
  avatar: '',
  rating: 5,
  featured: false,
};

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => (await api.get('/admin/testimonials')).data.data as Testimonial[],
  });

  const saveTestimonial = useMutation({
    mutationFn: (data: typeof emptyForm & { id?: string }) =>
      data.id
        ? api.patch(`/admin/testimonials/${data.id}`, data)
        : api.post('/admin/testimonials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      resetForm();
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/testimonials/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(t: Testimonial) {
    setForm({
      name: t.name,
      company: t.company || '',
      role: t.role || '',
      quote: t.quote,
      avatar: t.avatar || '',
      rating: t.rating,
      featured: t.featured ?? false,
    });
    setEditingId(t.id);
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
    saveTestimonial.mutate(editingId ? { ...form, id: editingId } : form);
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Testimonials</h1>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Cancel' : 'Add Testimonial'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-premium mb-8 space-y-4 rounded-2xl p-6">
          <h2 className="font-semibold">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Role</label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Company</label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Rating (1–5)</label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-surface-gray">Quote *</label>
            <Textarea
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              rows={4}
              required
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
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded"
            />
            Featured on homepage
          </label>
          <Button type="submit" disabled={saveTestimonial.isPending}>
            {saveTestimonial.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {testimonials?.map((t) => (
          <div key={t.id} className="glass-premium flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{t.name}</h3>
                {t.featured && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">Featured</span>
                )}
              </div>
              <p className="text-xs text-surface-gray">
                {[t.role, t.company].filter(Boolean).join(' · ')} · {t.rating}★
              </p>
              <p className="mt-2 text-sm text-surface-gray line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(t)}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => deleteTestimonial.mutate(t.id)}>Delete</Button>
            </div>
          </div>
        ))}
        {!testimonials?.length && <p className="text-surface-gray">No testimonials yet.</p>}
      </div>
    </div>
  );
}