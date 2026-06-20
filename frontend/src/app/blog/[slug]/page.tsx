import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createMetadata, siteConfig } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { NewsletterSignup } from '@/components/blog/newsletter-signup';
import { BlogContent, type BlogBlock } from '@/components/blog/blog-content';
import type { Blog } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const blog = await fetcher<Blog>(`/blogs/${slug}`);
    return createMetadata({
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      path: `/blog/${slug}`,
      image: blog.featuredImage,
    });
  } catch {
    return createMetadata({ title: 'Article' });
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let blog: Blog;
  let related: Blog[] = [];
  try {
    [blog, related] = await Promise.all([
      fetcher<Blog>(`/blogs/${slug}`),
      fetcher<Blog[]>(`/blogs/${slug}/related`),
    ]);
  } catch {
    notFound();
  }

  const blocks = (Array.isArray(blog.content) ? blog.content : []) as BlogBlock[];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    author: { '@type': 'Person', name: blog.author.name },
    datePublished: blog.publishedAt,
    publisher: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span className="text-sm font-medium text-accent">{blog.category?.name}</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{blog.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-surface-gray">
            <span>{blog.author.name}</span>
            <span>·</span>
            <span>{blog.publishedAt ? formatDate(blog.publishedAt) : ''}</span>
            <span>·</span>
            <span>{blog.readingTime} min read</span>
          </div>

          {blog.featuredImage && (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {blocks.length > 0 ? (
            <BlogContent blocks={blocks} />
          ) : (
            <p className="mt-12 text-base leading-relaxed text-surface-gray sm:text-lg">
              {blog.excerpt || 'Content coming soon.'}
            </p>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            {['twitter', 'linkedin', 'facebook'].map((platform) => (
              <a
                key={platform}
                href={`https://${platform === 'twitter' ? 'twitter.com/intent/tweet' : platform === 'linkedin' ? 'www.linkedin.com/sharing/share-offsite' : 'www.facebook.com/sharer/sharer.php'}?url=${encodeURIComponent(`${siteConfig.url}/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm capitalize transition-colors hover:bg-muted"
              >
                Share on {platform}
              </a>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-muted/40 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-6 font-display text-xl font-bold">Related Articles</h2>
            <div className="space-y-4">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="block glass-premium rounded-2xl p-4 transition-all hover:shadow-glow">
                  <h3 className="font-medium hover:text-brand">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <NewsletterSignup />
        </div>
      </section>
    </>
  );
}