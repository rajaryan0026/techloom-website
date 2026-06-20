import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendEmail, verificationEmailHtml, resetPasswordEmailHtml } from '../services/email.service';
import { AppError, NotFoundError } from '../utils/errors';

const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:3000';

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, email, password, phone, company } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, 'Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone, company },
    });

    const token = uuidv4();
    await prisma.emailToken.create({
      data: {
        token,
        userId: user.id,
        type: 'verify',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendEmail(
      email,
      'Verify your Techloom account',
      verificationEmailHtml(name, `${frontendUrl()}/auth/verify-email?token=${token}`)
    );

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) throw new AppError(401, 'Refresh token required');

    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new AppError(401, 'Invalid refresh token');
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new NotFoundError('User not found');

    const newPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(newPayload);

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
      });
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = uuidv4();
      await prisma.emailToken.create({
        data: {
          token,
          userId: user.id,
          type: 'reset',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
      await sendEmail(
        email,
        'Reset your Techloom password',
        resetPasswordEmailHtml(user.name, `${frontendUrl()}/auth/reset-password?token=${token}`)
      );
    }
    res.json({ success: true, message: 'If the email exists, a reset link was sent' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    const emailToken = await prisma.emailToken.findUnique({ where: { token } });
    if (!emailToken || emailToken.used || emailToken.expiresAt < new Date() || emailToken.type !== 'reset') {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: emailToken.userId }, data: { passwordHash } }),
      prisma.emailToken.update({ where: { id: emailToken.id }, data: { used: true } }),
    ]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const emailToken = await prisma.emailToken.findUnique({ where: { token } });
    if (!emailToken || emailToken.used || emailToken.expiresAt < new Date() || emailToken.type !== 'verify') {
      throw new AppError(400, 'Invalid or expired verification token');
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: emailToken.userId }, data: { emailVerified: true } }),
      prisma.emailToken.update({ where: { id: emailToken.id }, data: { used: true } }),
    ]);

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
}