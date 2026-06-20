import Link from 'next/link';
import { Logo } from './logo';
import { siteConfig } from '@/lib/seo';
import { siteContact } from '@/lib/site';
import { Instagram, Phone } from 'lucide-react';

const footerLinks = {
  Services: [
    { href: '/services/ai-automation', label: 'AI Automation' },
    { href: '/services/performance-marketing', label: 'Performance Marketing' },
    { href: '/services/web-development', label: 'Web Development' },
    { href: '/services/ai-courses', label: 'AI Courses' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/founder', label: 'Founder' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-card">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{siteConfig.tagline}</p>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${siteContact.phoneRaw}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Phone className="h-4 w-4" /> {siteContact.phone}
              </a>
              <a href={siteContact.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Instagram className="h-4 w-4" /> @{siteContact.instagram}
              </a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Techloom. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Founded by Raj Aryan · AI Expert</p>
        </div>
      </div>
    </footer>
  );
}