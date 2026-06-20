'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function SavedBlogsPage() {
  const queryClient = useQueryClient();
  const { data: saved, isLoading } = useQuery({
    queryKey: ['saved-blogs'],
    queryFn: async () => (await api.get('/users/me/saved-blogs')).data.data,
  });

  const unsave = useMutation({
    mutationFn: (blogId: string) => api.delete(`/users/me/saved-blogs/${blogId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-blogs'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Blogs</h1>
      {saved?.length ? (
        <div className="space-y-4">
          {saved.map((s: { id: string; blog: { id: string; slug: string; title: string; excerpt?: string } }) => (
            <div key={s.id} className="glass rounded-xl p-4 flex justify-between items-center">
              <Link href={`/blog/${s.blog.slug}`} className="hover:text-brand">
                <h3 className="font-medium">{s.blog.title}</h3>
                <p className="text-sm text-surface-gray line-clamp-1">{s.blog.excerpt}</p>
              </Link>
              <Button size="sm" variant="outline" onClick={() => unsave.mutate(s.blog.id)}>Remove</Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-surface-gray">No saved articles yet.</p>
      )}
    </div>
  );
}