'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Calendar, Bookmark, Bell, LifeBuoy, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/projects', label: 'My Projects', icon: FolderKanban },
  { href: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { href: '/dashboard/saved-blogs', label: 'Saved Blogs', icon: Bookmark },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/support', label: 'Support', icon: LifeBuoy },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 border-r border-white/5 p-6 hidden lg:block">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
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
        <button onClick={() => logout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-surface-gray hover:bg-white/5">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
    </aside>
  );
}