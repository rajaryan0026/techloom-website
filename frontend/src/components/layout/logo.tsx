'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const heightClass = {
  sm: 'h-8',
  md: 'h-9',
  lg: 'h-12',
};

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <motion.div
        className="logo-backdrop"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <Image
          src="/techloom-logo.png"
          alt="Techloom — Where Technology Meets Trust"
          width={160}
          height={160}
          priority
          className={`logo-image ${heightClass[size]}`}
        />
      </motion.div>
    </Link>
  );
}