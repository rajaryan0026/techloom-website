import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, AppError } from '../utils/errors';
import { uploadFile } from '../services/upload.service';
import { getParam } from '../utils/params';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, phone: true, company: true, avatar: true, role: true, emailVerified: true, createdAt: true },
    });
    if (!user) throw new NotFoundError();
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, phone, company } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { name, phone, company },
      select: { id: true, name: true, email: true, phone: true, company: true, avatar: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new AppError(400, 'Current password is incorrect');
    }
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) throw new AppError(400, 'No file uploaded');
    const uploaded = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { avatar: uploaded.url },
      select: { id: true, avatar: true },
    });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getMyProjects(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await prisma.project.findMany({
      where: { clientId: req.user!.userId },
      include: { deliverables: true, invoices: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
}

export async function getMyProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: getParam(req, 'id'), clientId: req.user!.userId },
      include: { deliverables: true, invoices: true },
    });
    if (!project) throw new NotFoundError();
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}

export async function getMyBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.userId },
      include: { service: true },
      orderBy: { datetime: 'desc' },
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

export async function getSavedBlogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const saved = await prisma.savedBlog.findMany({
      where: { userId: req.user!.userId },
      include: { blog: { include: { author: { select: { name: true } }, category: true } } },
    });
    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
}

export async function saveBlog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const saved = await prisma.savedBlog.create({
      data: { userId: req.user!.userId, blogId: getParam(req, 'blogId') },
    });
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
}

export async function unsaveBlog(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.savedBlog.deleteMany({
      where: { userId: req.user!.userId, blogId: getParam(req, 'blogId') },
    });
    res.json({ success: true, message: 'Removed from saved' });
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.notification.updateMany({
      where: { id: getParam(req, 'id'), userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getSupportTickets(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user!.userId },
      include: { messages: { include: { sender: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
}

export async function createSupportTicket(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { subject, content, priority } = req.body;
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user!.userId,
        subject,
        priority,
        messages: { create: { senderId: req.user!.userId, content } },
      },
      include: { messages: true },
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
}

export async function addTicketMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: getParam(req, 'id'), userId: req.user!.userId },
    });
    if (!ticket) throw new NotFoundError();

    const message = await prisma.ticketMessage.create({
      data: { ticketId: ticket.id, senderId: req.user!.userId, content: req.body.content },
      include: { sender: { select: { name: true, role: true } } },
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
}