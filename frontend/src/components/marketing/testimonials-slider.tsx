'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import type { Testimonial } from '@/types';

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Our Clients Say"
          accent="Say"
          subtitle="Trusted by businesses worldwide"
        />

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <div className="glass-premium relative h-full rounded-3xl p-8 transition-all duration-500 hover:shadow-glow">
                    <Quote className="absolute right-6 top-6 h-10 w-10 text-brand/20" />
                    <div className="mb-5 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-brand text-brand" />
                      ))}
                    </div>
                    <p className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-8 border-t border-border pt-6">
                      <p className="font-display font-semibold">{t.name}</p>
                      <p className="text-sm text-surface-gray">
                        {t.role}{t.company ? `, ${t.company}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-2xl glass-premium p-3 transition-all hover:shadow-glow md:block"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-2xl glass-premium p-3 transition-all hover:shadow-glow md:block"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}