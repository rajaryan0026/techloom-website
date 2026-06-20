'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] p-12 text-center sm:p-20"
          style={{
            background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 40%, #6D28D9 70%, #4C1D95 100%)',
            boxShadow: '0 6px 0 rgba(76,29,149,0.8), 0 30px 80px -20px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.08]" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-brand-100/90">
              Book a free consultation and discover how AI can accelerate your growth.
            </p>
            <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-brand-700 shadow-3d-md hover:bg-brand-50 hover:text-brand-800">
                <Link href="/contact">
                  Book Free Consultation
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/25 text-white hover:border-white/40 hover:bg-white/10">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}