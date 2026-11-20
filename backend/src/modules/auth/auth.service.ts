import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { config } from '../../config';
import { verifyTelegramInitData } from '../../common/guards/telegram-auth.guard';
import { JwtPayload } from '../../common/middleware/jwt-auth.middleware';

export class AuthService {
  /**
   * Generates JWT token for user
   */
  generateToken(user: {
    id: string;
    agencyId: string;
    branchId: string | null;
    role: any;
    fullName: string;
    phone: string;
    telegramId: bigint | null;
  }): string {
    const payload: JwtPayload = {
      userId: user.id,
      agencyId: user.agencyId,
      branchId: user.branchId,
      role: user.role,
      fullName: user.fullName,
      phone: user.phone,
      telegramId: user.telegramId ? user.telegramId.toString() : null,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });
  }

  /**
   * Password login for web admin or agent panel
   */
  async loginWithPassword(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        agency: {
          select: { id: true, name: true, slug: true, isActive: true },
        },
      },
    });

    if (!user || !user.isActive || !user.agency.isActive) {
      throw new Error('Hisob topilmadi yoki faol emas');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Telefon/elektron pochta yoki parol noto‘g‘ri');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        agency: user.agency,
        branchId: user.branchId,
      },
    };
  }

  /**
   * Seamless login via Telegram Mini App initData
   */
  async loginWithTelegram(initDataString: string) {
    const verified = verifyTelegramInitData(initDataString);
    if (!verified || !verified.user) {
      throw new Error('Telegram imzosi yaroqsiz yoki muddati o‘tgan');
    }

    const tgUser = verified.user;
    const tgId = BigInt(tgUser.id);

    // Find user by telegramId
    let user = await prisma.user.findUnique({
      where: { telegramId: tgId },
      include: {
        agency: { select: { id: true, name: true, slug: true, isActive: true } },
      },
    });

    if (!user) {
      // If user does not exist yet, we check start_param to see if it's an invite or client
      throw new Error('Ushbu Telegram hisobi tizimda rieltor sifatida ro‘yxatdan o‘tmagan');
    }

    if (!user.isActive || !user.agency.isActive) {
      throw new Error('Rieltor hisobi to‘xtatilgan');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        telegramId: tgUser.id,
        agency: user.agency,
      },
    };
  }

  /**
   * Get current authenticated profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        agencyId: true,
        branchId: true,
        role: true,
        fullName: true,
        phone: true,
        email: true,
        telegramId: true,
        telegramUsername: true,
        avatarUrl: true,
        createdAt: true,
        agency: {
          select: { id: true, name: true, slug: true, plan: true },
        },
      },
    });

    if (!user) {
      throw new Error('Foydalanuvchi topilmadi');
    }

    return {
      ...user,
      telegramId: user.telegramId ? user.telegramId.toString() : null,
    };
  }
}

export const authService = new AuthService();
