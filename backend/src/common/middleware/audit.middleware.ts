import { AuditAction } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { Request } from 'express';

export interface CreateAuditLogParams {
  req: Request;
  action: AuditAction;
  entityName: string;
  entityId?: string;
  details?: Record<string, any>;
}

export async function recordAuditLog({
  req,
  action,
  entityName,
  entityId,
  details,
}: CreateAuditLogParams): Promise<void> {
  const agencyId = req.user?.agencyId || req.agencyId;
  if (!agencyId) return;

  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await prisma.auditLog.create({
      data: {
        agencyId,
        userId: req.user?.id || null,
        action,
        entityName,
        entityId: entityId || null,
        details: details || undefined,
        ipAddress: ipAddress.slice(0, 45),
        userAgent: userAgent.slice(0, 255),
      },
    });
  } catch (error) {
    // Non-blocking error handling for audit logs to not fail main business operations
    console.error('Audit Log recording failed:', error);
  }
}
