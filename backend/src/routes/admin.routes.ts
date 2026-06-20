import { Router } from 'express';
import multer from 'multer';
import { UserRole } from '@prisma/client';
import * as admin from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const router = Router();

router.use(authenticate, requireRole(UserRole.ADMIN, UserRole.EDITOR));

router.get('/analytics', admin.getAnalytics);
router.get('/leads', admin.getLeads);
router.patch('/leads/:id', admin.updateLead);
router.get('/blogs', admin.getAdminBlogs);
router.post('/blogs', admin.createBlog);
router.patch('/blogs/:id', admin.updateBlog);
router.delete('/blogs/:id', admin.deleteBlog);
router.get('/projects', admin.getProjects);
router.post('/projects', admin.createProject);
router.patch('/projects/:id', admin.updateProject);
router.post('/projects/:id/deliverables', upload.single('file'), admin.uploadDeliverable);
router.get('/media', admin.getMedia);
router.post('/media', upload.single('file'), admin.uploadMedia);
router.get('/users', admin.getUsers);
router.post('/categories', admin.createCategory);
router.get('/testimonials', admin.getTestimonials);
router.post('/testimonials', admin.createTestimonial);
router.patch('/testimonials/:id', admin.updateTestimonial);
router.delete('/testimonials/:id', admin.deleteTestimonial);
router.get('/team', admin.getTeamMembers);
router.post('/team', admin.createTeamMember);
router.patch('/team/:id', admin.updateTeamMember);
router.delete('/team/:id', admin.deleteTeamMember);
router.get('/portfolio', admin.getPortfolioItems);
router.post('/portfolio', admin.createPortfolioItem);
router.patch('/portfolio/:id', admin.updatePortfolioItem);
router.delete('/portfolio/:id', admin.deletePortfolioItem);

export default router;