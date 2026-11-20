import { Request, Response } from 'express';
import { authService } from './auth.service';
import { recordAuditLog } from '../../common/middleware/audit.middleware';
import { AuditAction } from '@prisma/client';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        res.status(400).json({ success: false, message: 'Telefon/Email va parol kiritilishi shart' });
        return;
      }

      const result = await authService.loginWithPassword(identifier, password);

      // Record audit log
      await recordAuditLog({
        req: { ...req, user: result.user as any, agencyId: result.user.agency.id } as Request,
        action: AuditAction.LOGIN,
        entityName: 'User',
        entityId: result.user.id,
        details: { method: 'password', identifier },
      });

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Kirishda xatolik yuz berdi' });
    }
  }

  async loginTelegram(req: Request, res: Response): Promise<void> {
    try {
      const { initData } = req.body;
      if (!initData) {
        res.status(400).json({ success: false, message: 'initData majburiy' });
        return;
      }

      const result = await authService.loginWithTelegram(initData);

      await recordAuditLog({
        req: { ...req, user: result.user as any, agencyId: result.user.agency.id } as Request,
        action: AuditAction.LOGIN,
        entityName: 'User',
        entityId: result.user.id,
        details: { method: 'telegram', telegramId: result.user.telegramId },
      });

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Telegram orqali kirishda xatolik' });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Autentifikatsiyadan o‘tilmagan' });
        return;
      }

      const profile = await authService.getProfile(req.user.id);
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message || 'Profil topilmadi' });
    }
  }
}

export const authController = new AuthController();
