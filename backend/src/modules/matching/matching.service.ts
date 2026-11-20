import { prisma } from '../../lib/prisma';
import { calculateMatchScore } from './matching.engine';
import { smsService } from '../notifications/sms.service';
import { MatchStatus, NotificationChannel, QueueStatus } from '@prisma/client';

export class MatchingService {
  /**
   * Reverse Matching: Triggered when a new property is created or price reduced.
   * Finds all active buyer preferences in the same agency and matches them.
   */
  async matchPropertyAgainstClients(propertyId: string) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { realtor: true },
    });

    if (!property || property.status !== 'ACTIVE') {
      return { matchesCount: 0 };
    }

    // Find all active client preferences for the agency
    const preferences = await prisma.clientPreference.findMany({
      where: {
        client: {
          agencyId: property.agencyId,
          status: 'ACTIVE',
        },
      },
      include: {
        client: true,
      },
    });

    let matchedCount = 0;

    for (const pref of preferences) {
      const matchResult = calculateMatchScore(property, pref);

      if (matchResult.isMatch) {
        matchedCount++;

        // Save or update match result in database
        const savedMatch = await prisma.matchResult.upsert({
          where: {
            preferenceId_propertyId: {
              preferenceId: pref.id,
              propertyId: property.id,
            },
          },
          update: {
            matchScore: matchResult.score,
            matchReasons: matchResult.reasons,
          },
          create: {
            preferenceId: pref.id,
            propertyId: property.id,
            matchScore: matchResult.score,
            matchReasons: matchResult.reasons,
            status: MatchStatus.PENDING,
          },
        });

        // If client opted in for SMS notification, dispatch notification
        if (pref.autoNotifySms && pref.client.phone) {
          // Check anti-spam: only send if not notified yet
          if (savedMatch.status === MatchStatus.PENDING) {
            const smsRes = await smsService.sendMatchSms(pref.client.phone, {
              id: property.id,
              district: property.district,
              rooms: property.rooms,
              price: Number(property.price),
              realtorPhone: property.realtor.phone,
            });

            if (smsRes.success) {
              await prisma.matchResult.update({
                where: { id: savedMatch.id },
                data: {
                  status: MatchStatus.NOTIFIED,
                  notifiedAt: new Date(),
                },
              });

              await prisma.notificationQueue.create({
                data: {
                  matchResultId: savedMatch.id,
                  recipientPhone: pref.client.phone,
                  channel: NotificationChannel.SMS,
                  messageContent: smsRes.message || '',
                  status: QueueStatus.SENT,
                  sentAt: new Date(),
                },
              });
            }
          }
        }
      }
    }

    return { matchesCount: matchedCount };
  }

  /**
   * Forward Matching: Triggered when a new buyer client preference is saved.
   * Finds matching active properties in the agency.
   */
  async matchClientAgainstProperties(clientId: string) {
    const preference = await prisma.clientPreference.findUnique({
      where: { clientId },
      include: { client: true },
    });

    if (!preference) return { matchesCount: 0 };

    const properties = await prisma.property.findMany({
      where: {
        agencyId: preference.client.agencyId,
        status: 'ACTIVE',
        dealType: preference.dealType,
      },
      include: {
        media: { take: 1 },
        realtor: true,
      },
    });

    const matches: Array<{ property: any; score: number }> = [];

    for (const property of properties) {
      const result = calculateMatchScore(property, preference);
      if (result.isMatch) {
        matches.push({ property, score: result.score });

        await prisma.matchResult.upsert({
          where: {
            preferenceId_propertyId: {
              preferenceId: preference.id,
              propertyId: property.id,
            },
          },
          update: {
            matchScore: result.score,
            matchReasons: result.reasons,
          },
          create: {
            preferenceId: preference.id,
            propertyId: property.id,
            matchScore: result.score,
            matchReasons: result.reasons,
            status: MatchStatus.PENDING,
          },
        });
      }
    }

    return {
      matchesCount: matches.length,
      matches: matches.sort((a, b) => b.score - a.score),
    };
  }
}

export const matchingService = new MatchingService();
