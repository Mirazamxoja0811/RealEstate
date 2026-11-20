export type DealType = 'SALE' | 'RENT_LONG' | 'RENT_DAILY';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'LAND' | 'NEW_BUILDING';
export type Renovation = 'EURO' | 'GOOD' | 'MEDIUM' | 'ROUGH_FINISH' | 'NEEDS_REPAIR';

export interface PropertyMedia {
  id: string;
  url: string;
  isCover: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  dealType: DealType;
  propertyType: PropertyType;
  price: number;
  currency: 'USD' | 'UZS';
  rooms: number;
  floor?: number;
  totalFloors?: number;
  areaTotal: number;
  renovation: Renovation;
  region: string;
  district: string;
  addressLine: string;
  landmark?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasFurniture?: boolean;
  media: PropertyMedia[];
  realtor: {
    id: string;
    fullName: string;
    phone: string;
    telegramUsername?: string;
  };
  owner?: {
    id: string;
    fullName: string;
    phone: string;
  };
  createdAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  clientType: 'BUYER' | 'TENANT' | 'SELLER' | 'LANDLORD';
  status: 'LEAD' | 'ACTIVE' | 'IN_DEAL' | 'COMPLETED' | 'ARCHIVED';
  preferences?: {
    dealType: DealType;
    propertyType: PropertyType;
    minPrice: number;
    maxPrice: number;
    rooms: number[];
    districts: string[];
  };
  createdAt: string;
}

export interface MatchItem {
  property: Property;
  score: number;
}
