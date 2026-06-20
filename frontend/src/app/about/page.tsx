import Image from 'next/image';
import { createMetadata } from '@/lib/seo';
import { fetcher } from '@/lib/api';
import { CTASection } from '@/components/marketing/cta-section';
import { PageHero } from '@/components/ui/page-hero';
import type { TeamMember } from '@/types';

export const metadata = createMetadata({
  title: 'About Us',
  description: 'Learn about Techloom — our mission, vision, team, and values.',
  path: '/about',
});

const values = [
  { title: 'Innovation', desc: 'We push boundaries with AI-first thinking.' },
  { title: 'Integrity', desc: 'Transparency and trust in every engagement.' },
  { title: 'Excellence', desc: 'Enterprise-grade quality in everything we deliver.' },
  { title: 'Partnership', desc: 'Your success is our success.' },
];

const timeline = [
  { year: '2020', event: 'Techloom founded with a vision to democratize AI for businesses.' },
  { year: '2021', event: 'Launched AI Automation division, serving 50+ clients.' },
  { year: '2022', event: 'Expanded to Performance Marketing and Web Development.' },
  { year: '2023', event: 'Reached 150+ clients and $10M+ in client revenue generated.' },
  { year: '2024', event: 'Launched AI Courses and enterprise SaaS platform development.' },
  { year: '2025', event: 'Global expansion with 300+ projects delivered.' },
];

export default async function AboutPage() {
  let team: TeamMember[] = [];
  try {
    team = await fetcher<TeamMember[]>('/team');
  } catch { /* empty */ }

  return (
    <>
      <PageHero title="About Techloom" accent="Techloom" subtitle="Where Technology Meets Trust" />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 space-y-12">
          <div className="glass-premium rounded-3xl p-8">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p className="mt-4 text-surface-gray leading-relaxed">
              Techloom was born from a simple belief: every business deserves access to enterprise-grade AI technology.
              Founded in 2020, we&apos;ve grown from a small team of AI enthusiasts to a full-service technology company
              serving clients across 20+ countries. Our @techloom00 community reflects our commitment to sharing knowledge
              and building trust through transparency.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-premium rounded-3xl p-8">
              <h2 className="text-xl font-bold text-brand">Mission</h2>
              <p className="mt-3 text-surface-gray">Empower businesses with AI-driven solutions that deliver measurable growth and lasting competitive advantage.</p>
            </div>
            <div className="glass-premium rounded-3xl p-8">
              <h2 className="text-xl font-bold text-brand">Vision</h2>
              <p className="mt-3 text-surface-gray">To be the world&apos;s most trusted AI-first technology partner for businesses of all sizes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="glass-premium rounded-3xl p-6 text-center">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-surface-gray">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="glass-premium rounded-3xl p-6 text-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-brand">{member.role}</p>
                  {member.bio && <p className="mt-2 text-xs text-surface-gray">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-lg font-bold text-brand">{t.year}</span>
                </div>
                <div className="relative flex-1 glass-premium rounded-2xl p-4">
                  <div className="absolute -left-3 top-5 h-3 w-3 rounded-full bg-brand" />
                  <p className="text-sm text-surface-gray">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}