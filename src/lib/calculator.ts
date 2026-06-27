// Standard Service Base Prices in IDR
export const SERVICE_BASE_PRICES: Record<string, number> = {
  'Film Production': 5000000,
  'Animation': 7000000,
  'Motion Graphic': 4000000,
  'Creative Visual': 4000000,
};

// Duration Multipliers
export const DURATION_MULTIPLIERS: Record<string, number> = {
  'Cepat': 1.5,
  'Normal': 1.0,
  'Kompleks': 2.0,
};

// Location Extra Fees in IDR
export const LOCATION_FEES: Record<string, number> = {
  'Studio RTS': 0,
  'Lokasi client': 500000,
  'Luar kota': 2500000,
};

// Addon Fees in IDR
export const ADDON_FEES = {
  talent: 1500000,
  equipment: 2000000,
};

export interface CalculatorInputs {
  serviceType: string;
  duration: string;
  location: string;
  talent: boolean;
  equipment: boolean;
}

export function calculateEstimate(inputs: CalculatorInputs) {
  const { serviceType, duration, location, talent, equipment } = inputs;

  const basePrice = SERVICE_BASE_PRICES[serviceType] || 4000000;
  const durationMultiplier = DURATION_MULTIPLIERS[duration] || 1.0;
  const locationFee = LOCATION_FEES[location] || 0;

  const talentFee = talent ? ADDON_FEES.talent : 0;
  const equipmentFee = equipment ? ADDON_FEES.equipment : 0;

  const minPrice = (basePrice * durationMultiplier) + locationFee + talentFee + equipmentFee;
  const maxPrice = minPrice * 1.3; // 30% margin buffer

  return {
    minPrice,
    maxPrice,
  };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
