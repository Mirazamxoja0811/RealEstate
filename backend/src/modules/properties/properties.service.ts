import { prisma } from '../../lib/prisma';
import { CreatePropertyDto, PropertyFilterDto } from './properties.types';
import { PropertyStatus, Role } from '@prisma/client';
import { matchingService } from '../matching/matching.service';

export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  if (phone.length < 7) return '***';
  return phone.slice(0, 7) + ' *** ** ' + phone.slice(-2);
}

export class PropertiesService {
  async createProperty(agencyId: string, realtorId: string, data: CreatePropertyDto) {
    const { mediaUrls, ownerId, branchId, ...propertyData } = data;

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        agencyId,
        realtorId,
        branchId: branchId || null,
        ownerId: ownerId || null,
        media: mediaUrls?.length
          ? {
              create: mediaUrls.map((url, index) => ({
                url,
                sortOrder: index,
                isCover: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        media: true,
        realtor: {
          select: { id: true, fullName: true, phone: true, telegramUsername: true },
        },
      },
    });

    // Asynchronously trigger Reverse Matching for all active buyers in background
    matchingService.matchPropertyAgainstClients(property.id).catch((err) => {
      console.error('[Async Matching Error]:', err);
    });

    return property;
  }

  async getProperties(agencyId: string, filter: PropertyFilterDto, currentUser?: { id: string; role: Role }) {
    const { page = 1, limit = 20, rooms, minPrice, maxPrice, ...otherFilters } = filter;
    const skip = (page - 1) * limit;

    const where: any = {
      agencyId,
      status: PropertyStatus.ACTIVE,
    };

    if (otherFilters.dealType) where.dealType = otherFilters.dealType;
    if (otherFilters.propertyType) where.propertyType = otherFilters.propertyType;
    if (otherFilters.region) where.region = { contains: otherFilters.region, mode: 'insensitive' };
    if (otherFilters.district) where.district = { contains: otherFilters.district, mode: 'insensitive' };
    if (otherFilters.currency) where.currency = otherFilters.currency;

    if (rooms) {
      if (Array.isArray(rooms)) {
        where.rooms = { in: rooms };
      } else {
        where.rooms = rooms;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          media: {
            orderBy: { sortOrder: 'asc' },
            take: 3,
          },
          realtor: {
            select: { id: true, fullName: true, phone: true, telegramUsername: true },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPropertyById(id: string, agencyId: string, currentUser?: { id: string; role: Role }) {
    const property = await prisma.property.findFirst({
      where: { id, agencyId },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        realtor: {
          select: { id: true, fullName: true, phone: true, telegramUsername: true, avatarUrl: true },
        },
        owner: {
          select: { id: true, fullName: true, phone: true, secondaryPhone: true },
        },
      },
    });

    if (!property) {
      throw new Error('Mulk topilmadi');
    }

    // Increment view count asynchronously
    prisma.property
      .update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    // Phone masking logic for owner:
    // Only Agency Admin, Branch Manager, or the responsible Realtor can see unmasked owner phone
    const canSeeOwnerPhone =
      currentUser &&
      (currentUser.role === Role.SUPER_ADMIN ||
        currentUser.role === Role.AGENCY_ADMIN ||
        currentUser.id === property.realtorId);

    if (property.owner && !canSeeOwnerPhone) {
      property.owner.phone = maskPhoneNumber(property.owner.phone);
      if (property.owner.secondaryPhone) {
        property.owner.secondaryPhone = maskPhoneNumber(property.owner.secondaryPhone);
      }
    }

    return property;
  }

  async updatePropertyStatus(id: string, agencyId: string, status: PropertyStatus) {
    return prisma.property.update({
      where: { id },
      data: { status },
    });
  }
}

export const propertiesService = new PropertiesService();
