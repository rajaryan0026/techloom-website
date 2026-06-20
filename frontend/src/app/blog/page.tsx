import Link from 'next/link';
import { PageHero } from '@/components/ui/page-hero';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { BlogSearch } from '@/components/blog/blog-search';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

export const metadata = createMetadata({
  title: 'Blog',
  description: 'AI insights, web development tips, and marketing strategies from Techloom.',
  path: '/blog',
});

export const revalidate = 3600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  params.set('limit', '12');

  let blogs: Blog[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];
  try {
    [blogs, categories] = await Promise.all([
      fetcher<Blog[]>(`/blogs?${params}`),
      fetcher<{ id: string; name: string; slug: string }[]>('/categories'),
    ]);
  } catch { /* empty */ }

  return (
    <>
      <PageHero
        title="Techloom Blog"
        accent="Blog"
        subtitle="Insights on AI, technology, and business growth"
      />

      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4">
          <BlogSearch categories={categories} />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.slug}`} className="group glass-premium rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg">
                  <p className="text-xs text-brand">{blog.category?.name || 'Article'}</p>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-brand transition-colors">{blog.title}</h2>
                  <p className="mt-2 text-sm text-surface-gray line-clamp-3">{blog.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-surface-gray">
                    <span>{blog.author.name}</span>
                    <span>{blog.readingTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-surface-gray py-12">No articles yet. Check back soon!</p>
          )}
        </div>
      </section>
    </>
  );
}