'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { ServicePricing } from '@/types';

export function PricingCalculator({ pricing }: { pricing: ServicePricing[] }) {
  const [selected, setSelected] = useState(0);
  const tier = pricing[selected];

  if (!tier) return null;

  const features = Array.isArray(tier.features) ? tier.features : [];

  return (
    <div className="glass rounded-2xl p-8">
      <h3 className="text-xl font-semibold mb-6">Pricing Calculator</h3>
      <div className="flex gap-2 mb-6 flex-wrap">
        {pricing.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(i)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selected === i ? 'bg-brand text-white' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {p.tier}
          </button>
        ))}
      </div>
      <div className="text-4xl font-bold text-brand">
        ${tier.price.toLocaleString()}
        <span className="text-base font-normal text-surface-gray"> / project</span>
      </div>
      <ul className="mt-6 space-y-2">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-2 text-sm text-surface-gray">
            <span className="text-brand">✓</span> {f}
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full">Get Started with {tier.tier}</Button>
    </div>
  );
}