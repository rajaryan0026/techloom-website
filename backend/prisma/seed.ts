import { PrismaClient, UserRole, PortfolioCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@Techloom123', 12);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@techloom.com';
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: 'Techloom Admin',
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const services = [
    {
      name: 'AI Automation',
      slug: 'ai-automation',
      description: 'Intelligent automation solutions that streamline operations and boost productivity.',
      icon: 'Bot',
      features: ['Chatbots', 'CRM Automation', 'WhatsApp Automation', 'Workflow Automation'],
      pricing: [
        { tier: 'Starter', price: 999, features: ['1 Chatbot', 'Basic CRM sync', 'Email support'] },
        { tier: 'Growth', price: 2499, popular: true, features: ['3 Automations', 'WhatsApp integration', 'Priority support'] },
        { tier: 'Enterprise', price: 4999, features: ['Unlimited workflows', 'Custom AI models', 'Dedicated manager'] },
      ],
      faqs: [
        { question: 'How long does implementation take?', answer: 'Most automations are live within 2-4 weeks.' },
        { question: 'Do you integrate with our existing tools?', answer: 'Yes, we integrate with 100+ platforms including CRMs, ERPs, and messaging apps.' },
      ],
    },
    {
      name: 'Performance Marketing',
      slug: 'performance-marketing',
      description: 'Data-driven marketing campaigns that deliver measurable ROI and scalable growth.',
      icon: 'TrendingUp',
      features: ['Meta Ads', 'Google Ads', 'Lead Generation', 'Conversion Optimization'],
      pricing: [
        { tier: 'Launch', price: 1500, features: ['1 Ad platform', 'Monthly reporting', 'Landing page audit'] },
        { tier: 'Scale', price: 3500, popular: true, features: ['Multi-platform ads', 'A/B testing', 'Weekly optimization'] },
        { tier: 'Dominate', price: 7500, features: ['Full-funnel strategy', 'Creative production', 'Dedicated strategist'] },
      ],
      faqs: [
        { question: 'What is the minimum ad spend?', answer: 'We recommend a minimum of $1,000/month in ad spend for meaningful results.' },
      ],
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Premium websites and platforms built for performance, conversion, and scale.',
      icon: 'Globe',
      features: ['Business Websites', 'Ecommerce Websites', 'SaaS Platforms', 'Landing Pages'],
      pricing: [
        { tier: 'Business', price: 2999, features: ['5-page website', 'Mobile responsive', 'SEO setup'] },
        { tier: 'Ecommerce', price: 5999, popular: true, features: ['Full store setup', 'Payment integration', 'Inventory management'] },
        { tier: 'SaaS', price: 15000, features: ['Custom platform', 'Auth & dashboards', 'API development'] },
      ],
      faqs: [
        { question: 'What technologies do you use?', answer: 'Next.js, React, Node.js, PostgreSQL, and cloud-native infrastructure.' },
      ],
    },
    {
      name: 'AI Courses',
      slug: 'ai-courses',
      description: 'Practical AI training programs designed for business leaders and teams.',
      icon: 'GraduationCap',
      features: ['Prompt Engineering', 'AI Automation Training', 'Business AI Systems'],
      pricing: [
        { tier: 'Individual', price: 299, features: ['Self-paced modules', 'Certificate', 'Community access'] },
        { tier: 'Team', price: 999, popular: true, features: ['Up to 10 members', 'Live sessions', 'Custom use cases'] },
        { tier: 'Enterprise', price: 2999, features: ['Unlimited seats', 'On-site training', 'Custom curriculum'] },
      ],
      faqs: [
        { question: 'Are courses suitable for non-technical teams?', answer: 'Absolutely. Our courses are designed for business users with no coding background.' },
      ],
    },
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        features: s.features,
        order: i,
        pricing: { create: s.pricing.map((p) => ({ ...p, features: p.features })) },
        faqs: { create: s.faqs.map((f, idx) => ({ ...f, order: idx })) },
      },
    });
  }

  const stats = [
    { key: 'clients', value: '150+', label: 'Happy Clients' },
    { key: 'projects', value: '300+', label: 'Projects Delivered' },
    { key: 'revenue', value: '$10M+', label: 'Client Revenue Generated' },
    { key: 'satisfaction', value: '98%', label: 'Client Satisfaction' },
  ];

  for (const stat of stats) {
    await prisma.siteStat.upsert({
      where: { key: stat.key },
      update: stat,
      create: stat,
    });
  }

  const testimonials = [
    { name: 'Sarah Chen', company: 'NovaRetail', role: 'CEO', quote: 'Techloom transformed our operations with AI automation. Revenue up 40% in 6 months.', rating: 5, featured: true },
    { name: 'Marcus Johnson', company: 'GrowthLab', role: 'CMO', quote: 'Their performance marketing system delivered 3x ROAS from day one. Exceptional team.', rating: 5, featured: true },
    { name: 'Elena Rodriguez', company: 'FinEdge', role: 'CTO', quote: 'The SaaS platform they built handles 50K users flawlessly. True enterprise quality.', rating: 5, featured: true },
  ];

  if ((await prisma.testimonial.count()) === 0) {
    for (const t of testimonials) {
      await prisma.testimonial.create({ data: t });
    }
  }

  const portfolio = [
    {
      title: 'NovaRetail Ecommerce Platform',
      slug: 'novaretail-ecommerce',
      category: PortfolioCategory.WEBSITE,
      description: 'A premium ecommerce platform with AI-powered product recommendations.',
      images: ['/portfolio/novaretail-1.jpg', '/portfolio/novaretail-2.jpg'],
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
      results: { conversion: '+35%', revenue: '+$2M ARR', loadTime: '0.8s' },
      featured: true,
    },
    {
      title: 'GrowthLab AI Chatbot',
      slug: 'growthlab-ai-chatbot',
      category: PortfolioCategory.AI,
      description: 'Intelligent customer support chatbot handling 10K+ conversations monthly.',
      images: ['/portfolio/growthlab-1.jpg'],
      technologies: ['OpenAI', 'Node.js', 'WhatsApp API', 'CRM Integration'],
      results: { responseTime: '-80%', satisfaction: '94%', costSaving: '$50K/year' },
      featured: true,
    },
    {
      title: 'FinEdge Lead Generation Campaign',
      slug: 'finedge-lead-gen',
      category: PortfolioCategory.MARKETING,
      description: 'Multi-channel performance marketing campaign generating qualified B2B leads.',
      images: ['/portfolio/finedge-1.jpg'],
      technologies: ['Meta Ads', 'Google Ads', 'HubSpot', 'Analytics'],
      results: { leads: '500+/month', cpl: '-45%', roas: '4.2x' },
      featured: true,
    },
  ];

  for (const p of portfolio) {
    await prisma.portfolioItem.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  const team = [
    { name: 'Alex Rivera', role: 'Founder & CEO', bio: '15+ years building AI-first products for Fortune 500 companies.', order: 0 },
    { name: 'Priya Sharma', role: 'CTO', bio: 'Former Google engineer specializing in scalable AI infrastructure.', order: 1 },
    { name: 'James Okonkwo', role: 'Head of Marketing', bio: 'Performance marketing expert with $50M+ in managed ad spend.', order: 2 },
    { name: 'Mia Tanaka', role: 'Lead Designer', bio: 'Award-winning designer crafting premium digital experiences.', order: 3 },
  ];

  if ((await prisma.teamMember.count()) === 0) {
    for (const member of team) {
      await prisma.teamMember.create({ data: member });
    }
  }

  const categories = ['AI Insights', 'Web Development', 'Marketing', 'Automation'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
    });
  }

  console.log(`Seed complete. Admin: ${admin.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());