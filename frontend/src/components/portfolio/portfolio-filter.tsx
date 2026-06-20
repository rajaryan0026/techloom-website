'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const filters = [
  { label: 'All', value: '' },
  { label: 'Website Projects', value: 'WEBSITE' },
  { label: 'AI Projects', value: 'AI' },
  { label: 'Marketing Projects', value: 'MARKETING' },
];

export function PortfolioFilter({ current }: { current?: string }) {
  return (
    <div className="flex justify-center gap-2 mb-12 flex-wrap px-4">
      {filters.map((f) => (
        <Link
          key={f.value}
          href={f.value ? `/portfolio?category=${f.value}` : '/portfolio'}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-all',
            (current || '') === f.value
              ? 'bg-brand text-white'
              : 'bg-white/5 hover:bg-white/10'
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  );
}