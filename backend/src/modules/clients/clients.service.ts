import { prisma } from '../../lib/prisma';
import { CreateClientDto } from './clients.types';
import { ClientType, ClientStatus, Role } from '@prisma/client';
import { maskPhoneNumber } from '../properties/properties.service';
import { matchingService } from '../matching/matching.service';

export class ClientsService {
  async createClient(agencyId: string, realtorId: string, data: CreateClientDto) {
    const { preferences, telegramId, ...clientData } = data;

    const client = await prisma.client.create({
      data: {
        ...clientData,
        agencyId,
        realtorId,
        telegramId: telegramId ? BigInt(telegramId) : null,
        preferences: preferences
          ? {
              create: preferences,
            }
          : undefined,
      },
      include: {
        preferences: true,
        realtor: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });

    // If buyer has preferences, trigger forward matching asynchronously
    if (preferences) {
      matchingService.matchClientAgainstProperties(client.id).catch((err) => {
        console.error('[Async Matching Error]:', err);
      });
    }

    return {
      ...client,
      telegramId: client.telegramId ? client.telegramId.toString() : null,
    };
  }

  async getClients(
    agencyId: string,
    filter: {
      clientType?: ClientType;
      status?: ClientStatus;
      realtorId?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
    currentUser: { id: string; role: Role }
  ) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { agencyId };

    // Role-based visibility
    if (currentUser.role === Role.REALTOR) {
      where.realtorId = currentUser.id;
    } else if (filter.realtorId) {
      where.realtorId = filter.realtorId;
    }

    if (filter.clientType) where.clientType = filter.clientType;
    if (filter.status) where.status = filter.status;
    if (filter.search) {
      where.OR = [
        { fullName: { contains: filter.search, mode: 'insensitive' } },
        { phone: { contains: filter.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          preferences: true,
          realtor: {
            select: { id: true, fullName: true },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    const formattedItems = items.map((client) => {
      const canSeePhone =
        currentUser.role === Role.SUPER_ADMIN ||
        currentUser.role === Role.AGENCY_ADMIN ||
        currentUser.id === client.realtorId;

      return {
        ...client,
        phone: canSeePhone ? client.phone : maskPhoneNumber(client.phone),
        telegramId: client.telegramId ? client.telegramId.toString() : null,
      };
    });

    return {
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getClientById(id: string, agencyId: string, currentUser: { id: string; role: Role }) {
    const client = await prisma.client.findFirst({
      where: { id, agencyId },
      include: {
        preferences: {
          include: {
            matches: {
              include: {
                property: {
                  include: {
                    media: { take: 1 },
                  },
                },
              },
              orderBy: { matchScore: 'desc' },
            },
          },
        },
        realtor: {
          select: { id: true, fullName: true, phone: true },
        },
      },
    });

    if (!client) {
      throw new Error('Mijoz topilmadi');
    }

    const canSeePhone =
      currentUser.role === Role.SUPER_ADMIN ||
      currentUser.role === Role.AGENCY_ADMIN ||
      currentUser.id === client.realtorId;

    return {
      ...client,
      phone: canSeePhone ? client.phone : maskPhoneNumber(client.phone),
      telegramId: client.telegramId ? client.telegramId.toString() : null,
    };
  }
}

export const clientsService = new ClientsService();
