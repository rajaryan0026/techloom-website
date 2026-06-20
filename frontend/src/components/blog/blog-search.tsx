'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function BlogSearch({ categories }: { categories: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    router.push(`/blog?${params}`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-gray" />
        <Input
          placeholder="Search articles..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => router.push('/blog')}
          className="rounded-full px-3 py-1 text-xs font-medium bg-brand text-white"
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/blog?category=${c.slug}`)}
            className="rounded-full px-3 py-1 text-xs font-medium bg-white/5 hover:bg-white/10"
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}