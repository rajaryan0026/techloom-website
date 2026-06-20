import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { PortfolioItem } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const item = await fetcher<PortfolioItem>(`/portfolio/${slug}`);
    return createMetadata({ title: item.title, description: item.description, path: `/portfolio/${slug}` });
  } catch {
    return createMetadata({ title: 'Project' });
  }
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: PortfolioItem;
  try {
    item = await fetcher<PortfolioItem>(`/portfolio/${slug}`);
  } catch {
    notFound();
  }

  const techs = Array.isArray(item.technologies) ? item.technologies : [];
  const images = Array.isArray(item.images) ? item.images : [];
  const results = item.results || {};

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4">
          <span className="text-sm font-medium text-brand">{item.category}</span>
          <h1 className="mt-2 text-4xl font-bold">{item.title}</h1>
          <p className="mt-4 text-lg text-surface-gray">{item.description}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-4xl px-4">
          {images.length > 0 ? (
            <div className="mb-12 grid gap-4 sm:grid-cols-2">
              {images.map((src, i) => (
                <div key={src} className={`relative overflow-hidden rounded-2xl ${i === 0 && images.length % 2 !== 0 ? 'sm:col-span-2' : ''}`}>
                  <Image src={src} alt={`${item.title} ${i + 1}`} width={800} height={450} className="h-64 w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-12 flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 to-brand/5">
              <span className="text-6xl font-bold text-brand/20">{item.title.charAt(0)}</span>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {techs.map((t: string) => (
                  <span key={t} className="rounded-full bg-brand/10 px-3 py-1 text-sm text-brand">{t}</span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Results Achieved</h2>
              <div className="space-y-3">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-surface-gray capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-semibold text-brand">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/contact">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}