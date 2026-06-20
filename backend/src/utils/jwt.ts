import jwt, { type SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

const accessExpires = (process.env.JWT_ACCESS_EXPIRES || '15m') as SignOptions['expiresIn'];
const refreshExpires = (process.env.JWT_REFRESH_EXPIRES || '7d') as SignOptions['expiresIn'];

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: accessExpires });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: refreshExpires });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
}