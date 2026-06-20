import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { PortfolioFilter } from '@/components/portfolio/portfolio-filter';
import type { PortfolioItem } from '@/types';

export const metadata = createMetadata({
  title: 'Portfolio',
  description: 'Explore our website, AI, and marketing project portfolio.',
  path: '/portfolio',
});

export const revalidate = 3600;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let items: PortfolioItem[] = [];
  try {
    const query = category ? `?category=${category}` : '';
    items = await fetcher<PortfolioItem[]>(`/portfolio${query}`);
  } catch { /* empty */ }

  return (
    <>
      <PageHero
        title="Our Portfolio"
        accent="Portfolio"
        subtitle="Success stories from our client partnerships"
      />

      <PortfolioFilter current={category} />

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const cover = Array.isArray(item.images) && item.images[0] ? item.images[0] : null;
              return (
              <Link key={item.id} href={`/portfolio/${item.slug}`} className="group glass-premium overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg">
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-brand/25 via-brand/10 to-accent/5">
                  {cover ? (
                    <Image src={cover} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="text-4xl font-bold text-brand/30">{item.title.charAt(0)}</span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-brand">{item.category}</span>
                  <h3 className="mt-1 font-semibold group-hover:text-brand transition-colors">{item.title}</h3>
                  <p className="mt-2 text-sm text-surface-gray line-clamp-2">{item.description}</p>
                </div>
              </Link>
            );
            })}
          </div>
          {items.length === 0 && (
            <p className="text-center text-surface-gray py-12">No projects found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
}