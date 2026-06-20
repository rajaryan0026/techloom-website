import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.techloom.live';

export const siteConfig = {
  name: 'Techloom',
  tagline: 'Where Technology Meets Trust',
  username: '@techloom00',
  phone: '+91 9709991060',
  whatsapp: '919709991060',
  instagram: 'techloom00',
  description: 'AI Automations, High-Converting Websites, and Performance Marketing Systems that help businesses scale faster.',
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.png`,
};

export function createMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
  const desc = description || siteConfig.description;
  const url = `${siteUrl}${path}`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      images: [{ url: image || siteConfig.ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      creator: siteConfig.username,
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.tagline,
    sameAs: [
      `https://instagram.com/${siteConfig.instagram}`,
      `https://twitter.com/${siteConfig.username.replace('@', '')}`,
    ],
  };
}