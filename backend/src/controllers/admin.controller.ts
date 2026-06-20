import { Response, NextFunction } from 'express';
import { BlogStatus, LeadStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';
import { slugify } from '../utils/slugify';
import { uploadFile } from '../services/upload.service';
import { logAudit } from '../services/audit.service';

export async function getAnalytics(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [totalUsers, totalLeads, totalProjects, leadsByStatus, blogViews, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.lead.count(),
      prisma.project.count(),
      prisma.lead.groupBy({ by: ['status'], _count: true }),
      prisma.blog.aggregate({ _sum: { viewCount: true } }),
      prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    ]);

    const recentLeads = await prisma.lead.findMany({ take: 5, orderBy: { createdAt: 'desc' } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalLeads,
        totalProjects,
        leadsByStatus,
        totalBlogViews: blogViews._sum.viewCount || 0,
        totalRevenue: revenue._sum.amount || 0,
        recentLeads,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getLeads(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const leads = await prisma.lead.findMany({
      where: status ? { status: status as LeadStatus } : undefined,
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
}

export async function updateLead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await logAudit(req.user?.userId, 'UPDATE', 'lead', { id: lead.id }, req.ip);
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}

export async function getAdminBlogs(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const blogs = await prisma.blog.findMany({
      include: { author: { select: { name: true } }, category: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
}

export async function createBlog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, content, excerpt, categoryId, status, scheduledAt, tags, seoTitle, seoDescription, featuredImage } = req.body;
    const slug = slugify(title);

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        status: status || BlogStatus.DRAFT,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: status === BlogStatus.PUBLISHED ? new Date() : null,
        seoTitle,
        seoDescription,
        featuredImage,
        authorId: req.user!.userId,
        tags: tags?.length
          ? { create: tags.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    await logAudit(req.user?.userId, 'CREATE', 'blog', { id: blog.id }, req.ip);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, content, excerpt, categoryId, status, scheduledAt, seoTitle, seoDescription, featuredImage } = req.body;
    const data: Record<string, unknown> = { content, excerpt, categoryId, status, scheduledAt, seoTitle, seoDescription, featuredImage };
    if (title) data.title = title;
    if (status === BlogStatus.PUBLISHED) data.publishedAt = new Date();

    const blog = await prisma.blog.update({ where: { id: req.params.id }, data });
    await logAudit(req.user?.userId, 'UPDATE', 'blog', { id: blog.id }, req.ip);
    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.blog.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.userId, 'DELETE', 'blog', { id: req.params.id }, req.ip);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getProjects(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await prisma.project.findMany({
      include: { client: { select: { id: true, name: true, email: true } }, deliverables: true, invoices: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await prisma.project.create({ data: req.body });
    await logAudit(req.user?.userId, 'CREATE', 'project', { id: project.id }, req.ip);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await prisma.project.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function uploadDeliverable(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new NotFoundError('No file');
    const uploaded = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    const deliverable = await prisma.projectDeliverable.create({
      data: { projectId: req.params.id, title: req.body.title || req.file.originalname, fileUrl: uploaded.url, fileType: req.file.mimetype },
    });
    res.status(201).json({ success: true, data: deliverable });
  } catch (err) {
    next(err);
  }
}

export async function getMedia(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' }, include: { uploader: { select: { name: true } } } });
    res.json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function uploadMedia(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new NotFoundError('No file');
    const uploaded = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    const media = await prisma.media.create({
      data: { url: uploaded.url, publicId: uploaded.publicId, type: uploaded.type, filename: req.file.originalname, size: req.file.size, uploadedBy: req.user!.userId },
    });
    res.status(201).json({ success: true, data: media });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, emailVerified: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name, slug: slugify(name) } });
    res.status(201).json({ success: true, data: category });
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

export async function createTestimonial(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    await logAudit(req.user?.userId, 'CREATE', 'testimonial', { id: testimonial.id }, req.ip);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await logAudit(req.user?.userId, 'UPDATE', 'testimonial', { id: testimonial.id }, req.ip);
    res.json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.userId, 'DELETE', 'testimonial', { id: req.params.id }, req.ip);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getTeamMembers(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: team });
  } catch (err) {
    next(err);
  }
}

export async function createTeamMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const member = await prisma.teamMember.create({ data: req.body });
    await logAudit(req.user?.userId, 'CREATE', 'teamMember', { id: member.id }, req.ip);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

export async function updateTeamMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const member = await prisma.teamMember.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await logAudit(req.user?.userId, 'UPDATE', 'teamMember', { id: member.id }, req.ip);
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

export async function deleteTeamMember(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.teamMember.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.userId, 'DELETE', 'teamMember', { id: req.params.id }, req.ip);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getPortfolioItems(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await prisma.portfolioItem.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function createPortfolioItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, ...rest } = req.body;
    const item = await prisma.portfolioItem.create({ data: { title, slug: slugify(title), ...rest } });
    await logAudit(req.user?.userId, 'CREATE', 'portfolio', { id: item.id }, req.ip);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updatePortfolioItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, ...rest } = req.body;
    const data: Record<string, unknown> = { ...rest };
    if (title) {
      data.title = title;
      data.slug = slugify(title);
    }

    const item = await prisma.portfolioItem.update({
      where: { id: req.params.id },
      data,
    });
    await logAudit(req.user?.userId, 'UPDATE', 'portfolio', { id: item.id }, req.ip);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deletePortfolioItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.portfolioItem.delete({ where: { id: req.params.id } });
    await logAudit(req.user?.userId, 'DELETE', 'portfolio', { id: req.params.id }, req.ip);
    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (err) {
    next(err);
  }
}