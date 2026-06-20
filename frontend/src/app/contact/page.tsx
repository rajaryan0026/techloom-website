import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { ContactForm } from '@/components/forms/contact-form';
import { PageHero } from '@/components/ui/page-hero';
import { InstagramEmbed } from '@/components/widgets/instagram-embed';
import { siteContact } from '@/lib/site';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import type { Service } from '@/types';

export const metadata = createMetadata({
  title: 'Contact',
  description: 'Get in touch with Techloom. Call, WhatsApp, or send us a message.',
  path: '/contact',
});

export default async function ContactPage() {
  let services: Service[] = [];
  try {
    services = await fetcher<Service[]>('/services');
  } catch { /* empty */ }

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  const contactCards = [
    { icon: Phone, title: 'Phone & Support', desc: siteContact.phone, href: `tel:${siteContact.phoneRaw}` },
    { icon: MessageCircle, title: 'WhatsApp', desc: `${siteContact.phone} — chat anytime`, href: `https://wa.me/${siteContact.whatsapp}` },
    { icon: Mail, title: 'Email', desc: siteContact.email, href: `mailto:${siteContact.email}` },
    { icon: MapPin, title: 'Location', desc: 'Global — Remote-first team' },
  ];

  return (
    <>
      <PageHero
        title="Get in Touch"
        accent="Touch"
        subtitle="Call, WhatsApp, or send us a message — we're here to help"
      />

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <ContactForm services={services} />

            <div className="space-y-5">
              {contactCards.map((card) => {
                const inner = (
                  <div className="glass-premium flex items-start gap-5 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-glow sm:p-7">
                    <div className="icon-3d flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-brand/10 text-accent">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold">{card.title}</h3>
                      <p className="mt-1 text-sm text-surface-gray">{card.desc}</p>
                    </div>
                  </div>
                );
                return card.href ? (
                  <a key={card.title} href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div key={card.title}>{inner}</div>
                );
              })}

              {mapsKey ? (
                <div className="glass-premium h-56 overflow-hidden rounded-3xl sm:h-64">
                  <iframe
                    title="Techloom Location"
                    src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=Techloom`}
                    className="h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-16">
            <InstagramEmbed />
          </div>
        </div>
      </section>
    </>
  );
}