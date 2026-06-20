import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AmbientBackground } from '@/components/effects/ambient-background';
import { SmoothMain } from '@/components/layout/smooth-main';
import { WhatsAppButton } from '@/components/widgets/whatsapp-button';
import { CookieConsent } from '@/components/widgets/cookie-consent';
import { CrispChat } from '@/components/widgets/crisp-chat';
import { createMetadata, organizationSchema } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  ...createMetadata({}),
  icons: {
    icon: '/techloom-logo.png',
    apple: '/techloom-logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} font-sans`}>
        <Providers>
          <AmbientBackground />
          <Navbar />
          <main className="relative min-h-screen overflow-x-hidden">
            <SmoothMain>{children}</SmoothMain>
          </main>
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
          <CrispChat />
        </Providers>
      </body>
    </html>
  );
}