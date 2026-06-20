'use client';

import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export default function AdminMediaPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: media, isLoading } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => (await api.get('/admin/media')).data.data,
  });

  const upload = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/admin/media', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-media'] }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div>
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])} />
          <Button onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
            {upload.isPending ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media?.map((m: { id: string; url: string; type: string; filename?: string; createdAt: string }) => (
          <div key={m.id} className="glass rounded-xl p-4">
            <div className="h-32 rounded-lg bg-white/5 flex items-center justify-center mb-3">
              {m.type === 'IMAGE' ? (
                <img src={m.url} alt={m.filename || ''} className="h-full w-full object-cover rounded-lg" />
              ) : (
                <span className="text-sm text-surface-gray">{m.type}</span>
              )}
            </div>
            <p className="text-sm font-medium truncate">{m.filename || 'Untitled'}</p>
            <p className="text-xs text-surface-gray">{formatDate(m.createdAt)}</p>
          </div>
        ))}
      </div>
      {!media?.length && <p className="text-surface-gray">No media uploaded yet.</p>}
    </div>
  );
}