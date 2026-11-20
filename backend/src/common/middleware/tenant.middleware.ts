import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';

/**
 * Ensures multi-tenant isolation.
 * For authenticated users: enforces req.user.agencyId.
 * For public mini-app requests: resolves agency by slug or header.
 */
export async function tenantMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  // If user is already authenticated via JWT
  if (req.user?.agencyId) {
    req.agencyId = req.user.agencyId;
    return next();
  }

  // If public request with agency slug (e.g. from Mini App headers or params)
  const agencySlug = (req.headers['x-agency-slug'] as string) || (req.query.agencySlug as string);
  const agencyIdHeader = req.headers['x-agency-id'] as string;

  if (agencyIdHeader) {
    req.agencyId = agencyIdHeader;
    return next();
  }

  if (agencySlug) {
    try {
      const agency = await prisma.agency.findUnique({
        where: { slug: agencySlug },
        select: { id: true, isActive: true },
      });

      if (!agency || !agency.isActive) {
        res.status(404).json({ success: false, message: 'Agency not found or inactive' });
        return;
      }

      req.agencyId = agency.id;
      return next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to resolve agency tenant' });
      return;
    }
  }

  next();
}
