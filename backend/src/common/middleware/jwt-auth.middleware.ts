import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  agencyId: string;
  branchId?: string | null;
  role: Role;
  fullName: string;
  phone: string;
  telegramId?: string | null;
}

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication token is required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    req.user = {
      id: decoded.userId,
      agencyId: decoded.agencyId,
      branchId: decoded.branchId,
      role: decoded.role,
      fullName: decoded.fullName,
      phone: decoded.phone,
      telegramId: decoded.telegramId ? BigInt(decoded.telegramId) : null,
    };

    req.agencyId = decoded.agencyId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
}
