import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';

export async function logAudit(
  userId: string | undefined,
  action: string,
  resource: string,
  metadata?: Record<string, unknown>,
  ip?: string
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      ip,
    },
  });
}