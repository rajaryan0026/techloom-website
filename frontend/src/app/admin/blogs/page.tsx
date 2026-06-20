'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { BlogEditor } from '@/components/admin/blog-editor';
import { formatDate } from '@/lib/utils';
import type { BlogBlock } from '@/components/blog/blog-content';

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => (await api.get('/admin/blogs')).data.data,
  });

  const createBlog = useMutation({
    mutationFn: (data: {
      title: string;
      excerpt: string;
      status: string;
      featuredImage?: string;
      content: BlogBlock[];
    }) => api.post('/admin/blogs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      setShowForm(false);
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/blogs/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-blogs'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold">Blog Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Close Editor' : 'Create Blog'}</Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <BlogEditor
            onSubmit={(data) => createBlog.mutate(data)}
            loading={createBlog.isPending}
          />
        </div>
      )}

      <div className="space-y-3">
        {blogs?.map((b: { id: string; title: string; status: string; updatedAt: string; featuredImage?: string }) => (
          <div key={b.id} className="glass-premium flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">{b.title}</h3>
              <p className="text-xs text-surface-gray">{b.status} · {formatDate(b.updatedAt)}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => deleteBlog.mutate(b.id)}>Delete</Button>
          </div>
        ))}
        {!blogs?.length && <p className="text-surface-gray">No blogs yet. Create your first article!</p>}
      </div>
    </div>
  );
}