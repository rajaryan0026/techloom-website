import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import { isEmailConfigured, verifyEmailConnection } from './services/email.service';

const app = express();

const productionOrigins = [
  'https://www.techloom.live',
  'https://techloom.live',
  'http://localhost:3000',
];

const allowedOrigins = [
  ...new Set([
    ...productionOrigins,
    ...(process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean),
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
  ]),
];

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', async (_req, res) => {
  const configured = isEmailConfigured();
  const email = configured ? await verifyEmailConnection() : { ok: false, reason: 'SMTP not configured' };
  res.json({
    status: 'ok',
    service: 'techloom-api',
    email: { configured, ...email },
  });
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;