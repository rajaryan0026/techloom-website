import { Response, NextFunction } from 'express';
import { BlogStatus, LeadStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';
import { sendContactEmails } from '../services/email.service';
import { sendWhatsAppNotification } from '../services/whatsapp.service';
import { getParam } from '../utils/params';

export async function getServices(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: { pricing: true, faqs: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

export async function getServiceBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: getParam(req, 'slug') },
      include: { pricing: true, faqs: { orderBy: { order: 'asc' } } },
    });
    if (!service) throw new NotFoundError('Service not found');
    res.json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
}

export async function getPortfolio(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { category } = req.query;
    const items = await prisma.portfolioItem.findMany({
      where: category ? { category: category as never } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getPortfolioBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { slug: getParam(req, 'slug') } });
    if (!item) throw new NotFoundError('Portfolio item not found');
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function getBlogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { search, category, tag, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { status: BlogStatus.PUBLISHED };
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { excerpt: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (category) where.category = { slug: String(category) };
    if (tag) where.tags = { some: { tag: { slug: String(tag) } } };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getBlogBySlug(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: getParam(req, 'slug') },
      include: {
        author: { select: { id: true, name: true, avatar: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: {
          where: { approved: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!blog || blog.status !== BlogStatus.PUBLISHED) throw new NotFoundError('Blog not found');

    await prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } });
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

export async function getRelatedBlogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: getParam(req, 'slug') } });
    if (!blog) throw new NotFoundError();

    const related = await prisma.blog.findMany({
      where: {
        status: BlogStatus.PUBLISHED,
        id: { not: blog.id },
        OR: [
          { categoryId: blog.categoryId },
          { tags: { some: { tagId: { in: (await prisma.blogTag.findMany({ where: { blogId: blog.id }, select: { tagId: true } })).map((t) => t.tagId) } } } },
        ],
      },
      take: 3,
      include: { author: { select: { name: true, avatar: true } }, category: true },
    });

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: getParam(req, 'slug') } });
    if (!blog) throw new NotFoundError('Blog not found');
    if (!req.user) throw new NotFoundError('Login required to comment');

    const comment = await prisma.comment.create({
      data: { content: req.body.content, blogId: blog.id, userId: req.user.userId },
      include: { user: { select: { name: true, avatar: true } } },
    });

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
}

export async function getTestimonials(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await prisma.siteStat.findMany();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

export async function getTeam(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: team });
  } catch (err) {
    next(err);
  }
}

export async function submitContact(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, company, serviceId, message } = req.body;

    let resolvedServiceId: string | null = null;
    let serviceName: string | undefined;
    if (serviceId && typeof serviceId === 'string') {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) {
        resolvedServiceId = service.id;
        serviceName = service.name;
      }
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        message,
        serviceId: resolvedServiceId,
        source: 'contact',
        status: LeadStatus.NEW,
      },
    });

    let emailResults = { adminResult: { sent: false }, userResult: { sent: false } };
    try {
      emailResults = await sendContactEmails({
        name,
        email,
        phone,
        company,
        message,
        service: serviceName,
      });
    } catch (err) {
      console.error('[Contact] Email delivery failed:', err);
    }

    try {
      await sendWhatsAppNotification(
        `New Techloom contact from ${name} (${email}). Message: ${message.slice(0, 100)}`
      );
    } catch {
      // WhatsApp is optional
    }

    res.status(201).json({
      success: true,
      data: lead,
      message: emailResults.adminResult.sent
        ? 'Message sent successfully'
        : 'Message saved — email delivery is not configured yet',
      emailSent: emailResults.adminResult.sent,
    });
  } catch (err) {
    next(err);
  }
}

export async function subscribeNewsletter(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const sub = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });
    res.status(201).json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
}

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...req.body,
        datetime: new Date(req.body.datetime),
        userId: req.user?.userId,
      },
    });

    await sendWhatsAppNotification(
      `New consultation booking from ${req.body.name} on ${new Date(req.body.datetime).toLocaleString()}`
    );

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

export async function getCategories(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}