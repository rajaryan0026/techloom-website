import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo';
import { PageHero } from '@/components/ui/page-hero';
import { Button } from '@/components/ui/button';
import { InstagramEmbed } from '@/components/widgets/instagram-embed';
import { siteContact } from '@/lib/site';
import { ArrowRight, Brain, Rocket, Users, Award } from 'lucide-react';

export const metadata = createMetadata({
  title: 'Founders — Raj Aryan & Prince Kumar',
  description: 'Meet Raj Aryan (AI Expert) and Prince Kumar (Web Dev Expert), the founders of Techloom. Building AI-first solutions that help businesses scale.',
  path: '/founder',
  image: '/raj-aryan-founder.jpg',
});

const highlights = [
  { icon: Brain, title: 'AI Expert', desc: 'Deep expertise in AI automation, LLMs, and intelligent business systems.' },
  { icon: Rocket, title: 'Growth Architect', desc: 'Designs high-converting websites and performance marketing funnels.' },
  { icon: Users, title: 'Trusted Partner', desc: 'Hands-on leadership with a client-first, results-driven approach.' },
  { icon: Award, title: 'Tech Leadership', desc: 'Enterprise-grade delivery with security, scale, and reliability.' },
];

export default function FounderPage() {
  return (
    <>
      <PageHero
        title="Meet Raj Aryan"
        accent="Aryan"
        subtitle="Founder & AI Expert at Techloom"
      />

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-fade-up">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-brand/10 blur-2xl" />
              <div className="glass-premium relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
                <Image
                  src="/raj-aryan-founder.jpg"
                  alt="Raj Aryan — Founder & AI Expert at Techloom"
                  width={600}
                  height={700}
                  className="w-full rounded-[1.5rem] object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="animate-fade-up space-y-6" style={{ animationDelay: '0.15s' }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Founder</p>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Raj Aryan</h2>
                <p className="mt-1 text-lg text-brand-300">AI Expert</p>
              </div>

              <p className="text-base leading-relaxed text-surface-gray sm:text-lg">
                Raj Aryan founded Techloom with one mission: make enterprise-grade AI accessible to every business.
                From intelligent automations to high-converting digital experiences, he leads a team that turns
                ambitious ideas into measurable growth.
              </p>

              <p className="text-base leading-relaxed text-surface-gray">
                With deep expertise in AI systems, web engineering, and performance marketing, Raj partners directly
                with clients to design solutions that scale — fast, secure, and built for the future.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Work With Raj
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`https://wa.me/${siteContact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp {siteContact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-24 grid items-center gap-12 border-t border-border/50 pt-24 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up order-2 space-y-6 lg:order-1" style={{ animationDelay: '0.15s' }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Co-Founder</p>
                <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Prince Kumar</h2>
                <p className="mt-1 text-lg text-brand-300">Web Dev Expert</p>
              </div>

              <p className="text-base leading-relaxed text-surface-gray sm:text-lg">
                Prince Kumar co-founded Techloom to bring world-class web engineering to every client engagement.
                He crafts fast, responsive, and visually stunning digital experiences that turn visitors into
                customers.
              </p>

              <p className="text-base leading-relaxed text-surface-gray">
                With deep expertise in modern frontend frameworks, performance optimization, and scalable
                architecture, Prince ensures every Techloom product is polished, reliable, and built to
                perform at scale.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Work With Prince
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`https://wa.me/${siteContact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp {siteContact.phone}
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative order-1 mx-auto w-full max-w-md animate-fade-up lg:order-2 lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand/20 via-transparent to-accent/10 blur-2xl" />
              <div className="glass-premium relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
                <Image
                  src="/prince-kumar-cofounder.jpg"
                  alt="Prince Kumar — Co-Founder & Web Dev Expert at Techloom"
                  width={600}
                  height={700}
                  className="w-full rounded-[1.5rem] object-cover object-top"
                />
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, i) => (
              <div
                key={item.title}
                className="glass-premium rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow animate-fade-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="icon-3d mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-brand/10 text-accent">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-gray">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <InstagramEmbed />
          </div>
        </div>
      </section>
    </>
  );
}