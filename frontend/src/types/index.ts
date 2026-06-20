export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'EDITOR';
  avatar?: string;
  phone?: string;
  company?: string;
  emailVerified?: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  features: string[];
  pricing: ServicePricing[];
  faqs: ServiceFAQ[];
}

export interface ServicePricing {
  id: string;
  tier: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: unknown;
  featuredImage?: string;
  readingTime: number;
  publishedAt?: string;
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  author: { id: string; name: string; avatar?: string };
  category?: { name: string; slug: string };
  tags?: { tag: { name: string; slug: string } }[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: 'WEBSITE' | 'AI' | 'MARKETING';
  description: string;
  images: string[];
  technologies: string[];
  results?: Record<string, string>;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  quote: string;
  avatar?: string;
  rating: number;
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  linkedin?: string;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  source: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  progress: number;
  technologies?: string[];
  results?: Record<string, string>;
  deliverables?: { id: string; title: string; fileUrl: string }[];
  invoices?: { id: string; amount: number; status: string }[];
}