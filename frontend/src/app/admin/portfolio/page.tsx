'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { PortfolioItem } from '@/types';
import { Plus, Trash2, X } from 'lucide-react';

const CATEGORIES = ['WEBSITE', 'AI', 'MARKETING'] as const;

type ResultRow = { key: string; value: string };

type PortfolioForm = {
  title: string;
  description: string;
  category: (typeof CATEGORIES)[number];
  technologies: string;
  images: string[];
  results: ResultRow[];
  featured: boolean;
};

const emptyForm: PortfolioForm = {
  title: '',
  description: '',
  category: 'WEBSITE',
  technologies: '',
  images: [],
  results: [],
  featured: false,
};

function parseTechnologies(tech: unknown): string {
  return Array.isArray(tech) ? tech.join(', ') : '';
}

function parseImages(images: unknown): string[] {
  return Array.isArray(images) ? images.filter((i): i is string => typeof i === 'string') : [];
}

function parseResults(results: unknown): ResultRow[] {
  if (!results || typeof results !== 'object') return [];
  return Object.entries(results as Record<string, string>).map(([key, value]) => ({ key, value }));
}

function toPayload(form: PortfolioForm) {
  const technologies = form.technologies
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const results = form.results.reduce<Record<string, string>>((acc, { key, value }) => {
    if (key.trim()) acc[key.trim()] = value.trim();
    return acc;
  }, {});

  return {
    title: form.title,
    description: form.description,
    category: form.category,
    technologies,
    images: form.images,
    results: Object.keys(results).length ? results : undefined,
    featured: form.featured,
  };
}

export default function AdminPortfolioPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: async () => (await api.get('/admin/portfolio')).data.data as PortfolioItem[],
  });

  const saveItem = useMutation({
    mutationFn: (data: ReturnType<typeof toPayload> & { id?: string }) =>
      data.id
        ? api.patch(`/admin/portfolio/${data.id}`, data)
        : api.post('/admin/portfolio', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      resetForm();
    },
  });

  const deleteItem = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/portfolio/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] }),
  });

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImageUrl('');
  }

  function startEdit(item: PortfolioItem) {
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      technologies: parseTechnologies(item.technologies),
      images: parseImages(item.images),
      results: parseResults(item.results),
      featured: item.featured ?? false,
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, images: [...f.images, data.data.url] }));
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl() {
    const url = imageUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageUrl('');
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  function addResultRow() {
    setForm((f) => ({ ...f, results: [...f.results, { key: '', value: '' }] }));
  }

  function updateResultRow(index: number, field: 'key' | 'value', value: string) {
    setForm((f) => ({
      ...f,
      results: f.results.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    }));
  }

  function removeResultRow(index: number) {
    setForm((f) => ({ ...f, results: f.results.filter((_, i) => i !== index) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = toPayload(form);
    saveItem.mutate(editingId ? { ...payload, id: editingId } : payload);
  }

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Portfolio</h1>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>
          {showForm ? 'Cancel' : 'Add Project'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-premium mb-8 space-y-4 rounded-2xl p-6">
          <h2 className="font-semibold">{editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-surface-gray">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as PortfolioForm['category'] })}
                className="flex h-12 w-full rounded-xl border border-border bg-card px-4 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-surface-gray">Description *</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-surface-gray">Technologies (comma-separated)</label>
            <Input
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="Next.js, React, PostgreSQL"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-surface-gray">Images</label>
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
              />
              <Button type="button" variant="outline" onClick={addImageUrl}>Add URL</Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {form.images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.images.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative">
                    <img src={url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs text-surface-gray">Results (key-value metrics)</label>
              <Button type="button" size="sm" variant="outline" onClick={addResultRow}>
                <Plus className="mr-1 h-3 w-3" /> Add Metric
              </Button>
            </div>
            {form.results.map((row, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <Input
                  value={row.key}
                  onChange={(e) => updateResultRow(i, 'key', e.target.value)}
                  placeholder="e.g. conversion"
                />
                <Input
                  value={row.value}
                  onChange={(e) => updateResultRow(i, 'value', e.target.value)}
                  placeholder="e.g. +35%"
                />
                <Button type="button" size="sm" variant="ghost" onClick={() => removeResultRow(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded"
            />
            Featured project
          </label>

          <Button type="submit" disabled={saveItem.isPending}>
            {saveItem.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {items?.map((item) => {
          const techs = parseTechnologies(item.technologies);
          const imgs = parseImages(item.images);
          return (
            <div key={item.id} className="glass-premium flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-1 gap-4">
                {imgs[0] ? (
                  <img src={imgs[0]} alt={item.title} className="h-16 w-24 flex-shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 font-bold text-brand">
                    {item.title.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.featured && (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-brand">{item.category}</p>
                  <p className="mt-1 text-sm text-surface-gray line-clamp-2">{item.description}</p>
                  {techs && <p className="mt-1 text-xs text-surface-gray">{techs}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteItem.mutate(item.id)}>Delete</Button>
              </div>
            </div>
          );
        })}
        {!items?.length && <p className="text-surface-gray">No portfolio items yet.</p>}
      </div>
    </div>
  );
}