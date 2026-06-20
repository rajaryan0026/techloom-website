'use client';

import Link from 'next/link';
import { Instagram, ExternalLink } from 'lucide-react';
import { siteContact } from '@/lib/site';

export function InstagramEmbed() {
  return (
    <div className="glass-premium overflow-hidden rounded-3xl">
      <div className="relative p-6 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-400/10" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 text-white shadow-lg">
              <Instagram className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold sm:text-2xl">@{siteContact.instagram}</h3>
              <p className="mt-1 text-sm text-surface-gray">AI tips, project updates & behind-the-scenes</p>
            </div>
          </div>
          <Link
            href={siteContact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Follow on Instagram
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-2 sm:gap-3">
          {[1, 2, 3].map((n) => (
            <Link
              key={n}
              href={siteContact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group aspect-square overflow-hidden rounded-2xl border border-border bg-muted transition-all hover:border-pink-400/40 hover:shadow-glow"
            >
              <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center transition-transform group-hover:scale-105">
                <Instagram className="h-6 w-6 text-pink-400/70" />
                <span className="text-[10px] text-surface-gray sm:text-xs">View on Instagram</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}