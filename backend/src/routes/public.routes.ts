import { Router } from 'express';
import * as publicCtrl from '../controllers/public.controller';
import { validate } from '../middleware/validate';
import { contactSchema, newsletterSchema, bookingSchema } from '../validators/contact.validator';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/services', publicCtrl.getServices);
router.get('/services/:slug', publicCtrl.getServiceBySlug);
router.get('/portfolio', publicCtrl.getPortfolio);
router.get('/portfolio/:slug', publicCtrl.getPortfolioBySlug);
router.get('/blogs', publicCtrl.getBlogs);
router.get('/blogs/:slug', publicCtrl.getBlogBySlug);
router.get('/blogs/:slug/related', publicCtrl.getRelatedBlogs);
router.post('/blogs/:slug/comments', authenticate, publicCtrl.createComment);
router.get('/testimonials', publicCtrl.getTestimonials);
router.get('/stats', publicCtrl.getStats);
router.get('/team', publicCtrl.getTeam);
router.get('/categories', publicCtrl.getCategories);
router.post('/contact', validate(contactSchema), publicCtrl.submitContact);
router.post('/newsletter', validate(newsletterSchema), publicCtrl.subscribeNewsletter);
router.post('/bookings', optionalAuth, validate(bookingSchema), publicCtrl.createBooking);

export default router;