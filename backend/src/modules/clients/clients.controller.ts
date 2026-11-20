import { Request, Response } from 'express';
import { clientsService } from './clients.service';
import { CreateClientSchema } from './clients.types';
import { recordAuditLog } from '../../common/middleware/audit.middleware';
import { AuditAction } from '@prisma/client';

export class ClientsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autentifikatsiyadan o‘tilmagan' });
        return;
      }

      const parseResult = CreateClientSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ success: false, errors: parseResult.error.format() });
        return;
      }

      const client = await clientsService.createClient(req.user.agencyId, req.user.id, parseResult.data);

      await recordAuditLog({
        req,
        action: AuditAction.CREATE,
        entityName: 'Client',
        entityId: client.id,
        details: { fullName: client.fullName, type: client.clientType },
      });

      res.status(201).json({ success: true, data: client });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Mijoz yaratishda xatolik' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autentifikatsiyadan o‘tilmagan' });
        return;
      }

      const result = await clientsService.getClients(req.user.agencyId, req.query as any, req.user);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Mijozlar ro‘yxatini olishda xatolik' });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autentifikatsiyadan o‘tilmagan' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const client = await clientsService.getClientById(id, req.user.agencyId, req.user);
      res.json({ success: true, data: client });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Mijoz topilmadi' });
    }
  }
}

export const clientsController = new ClientsController();
