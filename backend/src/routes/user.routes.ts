import { Router } from 'express';
import multer from 'multer';
import * as user from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

router.use(authenticate);

router.get('/me', user.getProfile);
router.patch('/me', user.updateProfile);
router.patch('/me/password', user.changePassword);
router.post('/me/avatar', upload.single('avatar'), user.uploadAvatar);
router.get('/me/projects', user.getMyProjects);
router.get('/me/projects/:id', user.getMyProject);
router.get('/me/bookings', user.getMyBookings);
router.get('/me/saved-blogs', user.getSavedBlogs);
router.post('/me/saved-blogs/:blogId', user.saveBlog);
router.delete('/me/saved-blogs/:blogId', user.unsaveBlog);
router.get('/me/notifications', user.getNotifications);
router.patch('/me/notifications/:id/read', user.markNotificationRead);
router.get('/me/support-tickets', user.getSupportTickets);
router.post('/me/support-tickets', user.createSupportTicket);
router.post('/me/support-tickets/:id/messages', user.addTicketMessage);

export default router;