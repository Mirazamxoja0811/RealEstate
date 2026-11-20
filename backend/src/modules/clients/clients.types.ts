import { z } from 'zod';
import { ClientType, ClientStatus, DealType, PropertyType, Currency, Renovation } from '@prisma/client';

export const ClientPreferenceSchema = z.object({
  dealType: z.nativeEnum(DealType),
  propertyType: z.nativeEnum(PropertyType),
  minPrice: z.number().positive(),
  maxPrice: z.number().positive(),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  rooms: z.array(z.number().int().positive()),
  regions: z.array(z.string()),
  districts: z.array(z.string()),
  minArea: z.number().positive().optional(),
  maxArea: z.number().positive().optional(),
  minFloor: z.number().int().optional(),
  maxFloor: z.number().int().optional(),
  renovationTypes: z.array(z.nativeEnum(Renovation)).default([]),
  hasMortgage: z.boolean().optional(),
  autoNotifySms: z.boolean().default(true),
  autoNotifyTg: z.boolean().default(true),
});

export const CreateClientSchema = z.object({
  clientType: z.nativeEnum(ClientType),
  status: z.nativeEnum(ClientStatus).default(ClientStatus.LEAD),
  fullName: z.string().min(2).max(100),
  phone: z.string().min(7).max(30),
  secondaryPhone: z.string().max(30).optional(),
  telegramId: z.number().int().optional(),
  telegramUsername: z.string().optional(),
  notes: z.string().optional(),
  preferences: ClientPreferenceSchema.optional(), // Only for BUYER or TENANT
});

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
export type ClientPreferenceDto = z.infer<typeof ClientPreferenceSchema>;
