import { Request, Response } from 'express';
import { propertiesService } from './properties.service';
import { CreatePropertySchema, PropertyFilterSchema } from './properties.types';
import { recordAuditLog } from '../../common/middleware/audit.middleware';
import { AuditAction } from '@prisma/client';

export class PropertiesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autentifikatsiyadan o‘tilmagan' });
        return;
      }

      const parseResult = CreatePropertySchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ success: false, errors: parseResult.error.format() });
        return;
      }

      const property = await propertiesService.createProperty(req.user.agencyId, req.user.id, parseResult.data);

      await recordAuditLog({
        req,
        action: AuditAction.CREATE,
        entityName: 'Property',
        entityId: property.id,
        details: { title: property.title, price: property.price },
      });

      res.status(201).json({ success: true, data: property });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Mulk yaratishda xatolik' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const agencyId = req.agencyId || req.user?.agencyId;
      if (!agencyId) {
        res.status(400).json({ success: false, message: 'Agency aniqlanmadi' });
        return;
      }

      const parseResult = PropertyFilterSchema.safeParse(req.query);
      if (!parseResult.success) {
        res.status(400).json({ success: false, errors: parseResult.error.format() });
        return;
      }

      const result = await propertiesService.getProperties(agencyId, parseResult.data, req.user);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Mulklar ro‘yxatini olishda xatolik' });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const agencyId = req.agencyId || req.user?.agencyId;
      if (!agencyId) {
        res.status(400).json({ success: false, message: 'Agency aniqlanmadi' });
        return;
      }

      const property = await propertiesService.getPropertyById(id, agencyId, req.user);
      res.json({ success: true, data: property });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Mulk topilmadi' });
    }
  }
}

export const propertiesController = new PropertiesController();
