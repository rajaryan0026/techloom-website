import { ServicesGrid } from '@/components/marketing/services-grid';
import { CTASection } from '@/components/marketing/cta-section';
import { PageHero } from '@/components/ui/page-hero';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import type { Service } from '@/types';

export const metadata = createMetadata({
  title: 'Services',
  description: 'AI Automation, Performance Marketing, Web Development, and AI Courses.',
  path: '/services',
});

export const revalidate = 3600;

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    services = await fetcher<Service[]>('/services');
  } catch { /* empty */ }

  return (
    <>
      <PageHero
        title="Our Services"
        accent="Services"
        subtitle="Comprehensive AI-powered solutions to accelerate your business growth."
      />
      <ServicesGrid services={services} showHeading={false} />
      <CTASection />
    </>
  );
}