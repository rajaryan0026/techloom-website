import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost', port: '4000' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async rewrites() {
    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'development' ? 'http://localhost:4000/api' : '');

    if (!apiBase || apiBase.startsWith('/')) {
      if (process.env.NODE_ENV === 'development') {
        return [{ source: '/api/:path*', destination: 'http://localhost:4000/api/:path*' }];
      }
      return [];
    }

    const origin = apiBase.replace(/\/api\/?$/, '');
    return [{ source: '/api/:path*', destination: `${origin}/api/:path*` }];
  },
};

export default nextConfig;