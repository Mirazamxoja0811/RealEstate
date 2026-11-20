import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        agencyId: string;
        branchId?: string | null;
        role: Role;
        fullName: string;
        phone: string;
        telegramId?: bigint | null;
      };
      agencyId?: string;
    }
  }
}

export {};
