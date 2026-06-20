'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, Video, Type, Trash2, Loader2 } from 'lucide-react';
import type { BlogBlock } from '@/components/blog/blog-content';

type BlockItem = BlogBlock & { id: string };

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function emptyParagraph(): BlockItem {
  return { id: newId(), type: 'paragraph', content: [{ type: 'text', text: '' }] };
}

interface BlogEditorProps {
  initial?: {
    title: string;
    excerpt: string;
    status: string;
    featuredImage?: string;
    blocks: BlockItem[];
  };
  onSubmit: (data: {
    title: string;
    excerpt: string;
    status: string;
    featuredImage?: string;
    content: BlogBlock[];
  }) => void;
  loading?: boolean;
}

export function BlogEditor({ initial, onSubmit, loading }: BlogEditorProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [status, setStatus] = useState(initial?.status || 'DRAFT');
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || '');
  const [blocks, setBlocks] = useState<BlockItem[]>(initial?.blocks?.length ? initial.blocks : [emptyParagraph()]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<{ blockId?: string; featured?: boolean; type: 'image' | 'video' }>({ type: 'image' });

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post('/admin/media', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.url as string;
  }

  function triggerUpload(type: 'image' | 'video', blockId?: string, featured = false) {
    uploadTarget.current = { blockId, featured, type };
    if (fileRef.current) {
      fileRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
      fileRef.current.click();
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = uploadTarget.current.blockId || 'featured';
    setUploading(key);
    try {
      const url = await uploadFile(file);
      const { blockId, featured, type } = uploadTarget.current;

      if (featured) {
        setFeaturedImage(url);
      } else if (blockId) {
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, type, url, content: undefined } : b))
        );
      } else {
        setBlocks((prev) => [...prev, { id: newId(), type, url }]);
      }
    } catch {
      alert('Upload failed. Make sure you are logged in as admin and the backend is running.');
    } finally {
      setUploading(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function updateParagraph(id: string, text: string) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, type: 'paragraph', content: [{ type: 'text', text }], url: undefined } : b
      )
    );
  }

  function removeBlock(id: string) {
    setBlocks((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev));
  }

  function handleSave() {
    const content: BlogBlock[] = blocks.map(({ id: _id, ...block }) => block);
    onSubmit({ title, excerpt, status, featuredImage: featuredImage || undefined, content });
  }

  return (
    <div className="glass-premium space-y-5 rounded-3xl p-6 sm:p-8">
      <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

      <Input placeholder="Blog title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Short excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          className="h-12 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
        <Button type="button" variant="outline" onClick={() => triggerUpload('image', undefined, true)} disabled={!!uploading}>
          {uploading === 'featured' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          Featured Image
        </Button>
      </div>

      {featuredImage && (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featuredImage} alt="Featured" className="max-h-48 w-full object-cover" />
          <button type="button" className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs" onClick={() => setFeaturedImage('')}>
            Remove
          </button>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-sm font-medium text-surface-gray">Content blocks</p>
        {blocks.map((block) => (
          <div key={block.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-accent">{block.type}</span>
              <button type="button" onClick={() => removeBlock(block.id)} className="text-surface-gray hover:text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {block.type === 'paragraph' && (
              <Textarea
                rows={4}
                placeholder="Write paragraph..."
                value={block.content?.[0]?.text || ''}
                onChange={(e) => updateParagraph(block.id, e.target.value)}
              />
            )}

            {(block.type === 'image' || block.type === 'video') && (
              <div className="space-y-3">
                <Input
                  placeholder={block.type === 'video' ? 'Video URL (upload, .mp4, or YouTube link)' : 'Image URL or upload below'}
                  value={block.url || ''}
                  onChange={(e) =>
                    setBlocks((prev) =>
                      prev.map((b) => (b.id === block.id ? { ...b, url: e.target.value } : b))
                    )
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => triggerUpload(block.type as 'image' | 'video', block.id)}
                  disabled={!!uploading}
                >
                  {uploading === block.id ? <Loader2 className="h-4 w-4 animate-spin" /> : `Upload ${block.type}`}
                </Button>
                {block.url && block.type === 'image' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={block.url} alt="" className="max-h-56 w-full rounded-xl object-cover" />
                )}
                {block.url && block.type === 'video' && !block.url.includes('youtube') && (
                  <video src={block.url} controls className="w-full rounded-xl" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setBlocks((p) => [...p, emptyParagraph()])}>
          <Type className="h-4 w-4" /> Add Text
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setBlocks((p) => [...p, { id: newId(), type: 'image', url: '' }])}>
          <ImagePlus className="h-4 w-4" /> Add Image
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setBlocks((p) => [...p, { id: newId(), type: 'video', url: '' }])}>
          <Video className="h-4 w-4" /> Add Video
        </Button>
      </div>

      <p className="text-xs text-surface-gray">
        Add text, image, or video blocks. Upload files directly or paste image/video/YouTube URLs.
      </p>

      <Button onClick={handleSave} disabled={loading || !title} className="w-full sm:w-auto">
        {loading ? 'Saving...' : 'Save Blog Post'}
      </Button>
    </div>
  );
}