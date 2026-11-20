import { z } from 'zod';
import { DealType, PropertyType, Renovation, Currency } from '@prisma/client';

export const CreatePropertySchema = z.object({
  dealType: z.nativeEnum(DealType),
  propertyType: z.nativeEnum(PropertyType),
  title: z.string().min(5).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  isNegotiable: z.boolean().default(true),

  rooms: z.number().int().positive(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  areaTotal: z.number().positive(),
  areaLiving: z.number().positive().optional(),
  renovation: z.nativeEnum(Renovation).default(Renovation.MEDIUM),
  buildingType: z.string().optional(),
  builtYear: z.number().int().optional(),

  region: z.string().min(2),
  district: z.string().min(2),
  addressLine: z.string().min(3),
  landmark: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  hasElevator: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasFurniture: z.boolean().default(false),
  hasGas: z.boolean().default(true),

  ownerId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

export type CreatePropertyDto = z.infer<typeof CreatePropertySchema>;

export const PropertyFilterSchema = z.object({
  dealType: z.nativeEnum(DealType).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  currency: z.nativeEnum(Currency).optional(),
  rooms: z.union([z.coerce.number(), z.array(z.coerce.number())]).optional(),
  region: z.string().optional(),
  district: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PropertyFilterDto = z.infer<typeof PropertyFilterSchema>;
