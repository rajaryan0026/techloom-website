'use client';

import { PageTransition } from '@/components/effects/page-transition';

export function SmoothMain({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}