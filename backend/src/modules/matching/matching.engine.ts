import { Property, ClientPreference, Renovation } from '@prisma/client';

export interface MatchScoreResult {
  score: number; // 0 to 100
  isMatch: boolean; // score >= 80
  reasons: {
    dealTypeMatch: boolean;
    propertyTypeMatch: boolean;
    locationScore: number;
    priceScore: number;
    roomsScore: number;
    renovationScore: number;
    areaScore: number;
  };
}

/**
 * Calculates weighted match score between a Property and Client Preference
 * Formula according to docs/03_smart_matching_engine.md
 */
export function calculateMatchScore(property: Property, preference: ClientPreference): MatchScoreResult {
  // 1. Deal Type Match (Strict: 25% weight or immediately 0)
  if (property.dealType !== preference.dealType) {
    return {
      score: 0,
      isMatch: false,
      reasons: {
        dealTypeMatch: false,
        propertyTypeMatch: false,
        locationScore: 0,
        priceScore: 0,
        roomsScore: 0,
        renovationScore: 0,
        areaScore: 0,
      },
    };
  }
  const dealScore = 100;

  // 2. Property Type Match (15% weight)
  const typeScore = property.propertyType === preference.propertyType ? 100 : 0;

  // 3. Location Match (25% weight)
  let locationScore = 0;
  const isDistrictMatch = preference.districts.some(
    (d) => d.toLowerCase() === property.district.toLowerCase()
  );
  const isRegionMatch = preference.regions.some(
    (r) => r.toLowerCase() === property.region.toLowerCase()
  );

  if (isDistrictMatch) {
    locationScore = 100;
  } else if (isRegionMatch) {
    locationScore = 35; // Same city/region, different district
  }

  // 4. Price Match (20% weight)
  let priceScore = 0;
  const propPrice = Number(property.price);
  const minPrice = Number(preference.minPrice);
  const maxPrice = Number(preference.maxPrice);

  if (propPrice >= minPrice && propPrice <= maxPrice) {
    priceScore = 100;
  } else if (propPrice > maxPrice && propPrice <= maxPrice * 1.05) {
    // 5% higher (room for negotiation)
    priceScore = 70;
  } else if (propPrice > maxPrice && propPrice <= maxPrice * 1.1) {
    // 10% higher
    priceScore = 40;
  } else if (propPrice < minPrice && propPrice >= minPrice * 0.8) {
    // Below minimum budget is acceptable to buyer
    priceScore = 90;
  }

  // 5. Rooms Match (15% weight)
  let roomsScore = 0;
  if (preference.rooms.includes(property.rooms)) {
    roomsScore = 100;
  } else if (
    preference.rooms.some((r) => Math.abs(r - property.rooms) === 1)
  ) {
    roomsScore = 40; // 1 room difference
  }

  // 6. Renovation Match (5% weight)
  let renovationScore = 50; // default neutral
  if (
    preference.renovationTypes.length === 0 ||
    preference.renovationTypes.includes(property.renovation)
  ) {
    renovationScore = 100;
  }

  // Calculate Weighted Total Score
  // Weights: Deal (25%), Type (15%), Location (25%), Price (20%), Rooms (15%)
  const totalScore = Math.round(
    dealScore * 0.25 +
      typeScore * 0.15 +
      locationScore * 0.25 +
      priceScore * 0.2 +
      roomsScore * 0.15
  );

  return {
    score: totalScore,
    isMatch: totalScore >= 80,
    reasons: {
      dealTypeMatch: true,
      propertyTypeMatch: typeScore === 100,
      locationScore,
      priceScore,
      roomsScore,
      renovationScore,
      areaScore: 100,
    },
  };
}
