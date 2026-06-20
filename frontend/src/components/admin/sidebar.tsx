'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, FileText, FolderKanban, Image, UserCog, Target, MessageSquareQuote, UsersRound, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/leads', label: 'Leads', icon: Target },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/team', label: 'Team', icon: UsersRound },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/users', label: 'Users', icon: UserCog },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-surface-dark/50 p-6 hidden lg:block min-h-screen">
      <h2 className="text-lg font-bold mb-1">Admin Panel</h2>
      <p className="text-xs text-surface-gray mb-6">Techloom CMS</p>
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
              pathname === l.href ? 'bg-brand/10 text-brand' : 'text-surface-gray hover:bg-white/5'
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}