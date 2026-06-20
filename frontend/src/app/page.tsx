import Link from 'next/link';
import { Hero } from '@/components/marketing/hero';
import { StatsCounter } from '@/components/marketing/stats-counter';
import { ServicesGrid } from '@/components/marketing/services-grid';
import { TestimonialsSlider } from '@/components/marketing/testimonials-slider';
import { WhyChooseUs } from '@/components/marketing/why-choose-us';
import { CTASection } from '@/components/marketing/cta-section';
import { SectionHeading } from '@/components/ui/section-heading';
import { fetcher } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Service, Testimonial, Blog } from '@/types';

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [stats, services, testimonials, blogs] = await Promise.all([
      fetcher<{ key: string; value: string; label: string }[]>('/stats'),
      fetcher<Service[]>('/services'),
      fetcher<Testimonial[]>('/testimonials'),
      fetcher<Blog[]>('/blogs?limit=3'),
    ]);
    return { stats, services, testimonials, blogs };
  } catch {
    return { stats: [], services: [], testimonials: [], blogs: [] };
  }
}

export default async function HomePage() {
  const { stats, services, testimonials, blogs } = await getHomeData();

  return (
    <>
      <Hero />
      {stats.length > 0 && <StatsCounter stats={stats} />}
      {services.length > 0 && <ServicesGrid services={services} />}
      <WhyChooseUs />

      {blogs.length > 0 && (
        <section className="relative py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                title="Latest Insights"
                accent="Insights"
                subtitle="From the Techloom blog"
                align="left"
                className="mb-0"
              />
              <Link
                href="/blog"
                className="shrink-0 rounded-xl border border-brand/30 bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand transition-all hover:bg-brand/20 hover:shadow-glow"
              >
                View all articles
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group glass-premium rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                    {blog.category?.name || 'Blog'}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-semibold transition-colors group-hover:text-brand-300">
                    {blog.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-surface-gray line-clamp-2">{blog.excerpt}</p>
                  <p className="mt-5 text-xs text-surface-gray">
                    {blog.publishedAt ? formatDate(blog.publishedAt) : ''} · {blog.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && <TestimonialsSlider testimonials={testimonials} />}
      <CTASection />
    </>
  );
}