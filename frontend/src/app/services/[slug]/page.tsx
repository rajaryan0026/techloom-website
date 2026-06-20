import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { PricingCalculator } from '@/components/marketing/pricing-calculator';
import { ConsultationForm } from '@/components/forms/consultation-form';
import type { Service } from '@/types';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await fetcher<Service>(`/services/${slug}`);
    return createMetadata({ title: service.name, description: service.description, path: `/services/${slug}` });
  } catch {
    return createMetadata({ title: 'Service' });
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service: Service;
  try {
    service = await fetcher<Service>(`/services/${slug}`);
  } catch {
    notFound();
  }

  const features = Array.isArray(service.features) ? service.features : [];

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm text-brand font-medium">Service</p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{service.name}</h1>
            <p className="mt-4 text-lg text-surface-gray">{service.description}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f: string) => (
              <div key={f} className="glass rounded-xl p-4 text-center">
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-8">Pricing</h2>
              <div className="space-y-4">
                {service.pricing.map((p) => (
                  <div key={p.id} className={`glass rounded-2xl p-6 ${p.popular ? 'border-brand/50 ring-1 ring-brand/30' : ''}`}>
                    {p.popular && <span className="text-xs font-medium text-brand">Most Popular</span>}
                    <div className="flex items-baseline justify-between mt-1">
                      <h3 className="text-lg font-semibold">{p.tier}</h3>
                      <span className="text-2xl font-bold text-brand">${p.price.toLocaleString()}</span>
                    </div>
                    <ul className="mt-4 space-y-1">
                      {(Array.isArray(p.features) ? p.features : []).map((f: string) => (
                        <li key={f} className="text-sm text-surface-gray">✓ {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <PricingCalculator pricing={service.pricing} />
          </div>
        </div>
      </section>

      {service.faqs.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <details key={faq.id} className="glass rounded-xl p-6 group">
                  <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-brand group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-surface-gray">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Book a Consultation</h2>
          <ConsultationForm serviceId={service.id} />
        </div>
      </section>
    </>
  );
}