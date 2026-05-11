
// 1. Data Foundation: Unit Normalization Constants
export const UNIT_WEIGHTS: Record<string, number> = {
  "90kg bag": 90,
  "50kg bag": 50,
  "debe": 16, // Approx 16kg for maize/beans
  "crate": 20, // Common for tomatoes/vegetables
  "kg": 1,
  "90kg": 90,
};

// 2. Data Model: User Portfolio
export type GrowthStage = "planting" | "growing" | "harvesting" | "stored";

export interface UserCrop {
  id: string; // Dynamic instance ID
  cropId: string; // Foreign key to CROP_REGISTRY
  area?: number; // in acres
  stage: GrowthStage;
  plantedAt?: string;
  expectedHarvest?: string;
  trackMarket: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3. Crop Registry
export type CropCategory = "grain" | "legume" | "vegetable" | "tuber" | "cash_crop";

export interface Crop {
  id: string;
  name: string;
  localNameSw: string;
  category: CropCategory;
  unitBase: "kg";
  active: boolean;
}

export const CROP_REGISTRY: Crop[] = [
  { id: "maize", name: "Maize", localNameSw: "Mahindi", category: "grain", unitBase: "kg", active: true },
  { id: "sorghum", name: "Sorghum", localNameSw: "Mtama", category: "grain", unitBase: "kg", active: true },
  { id: "millet", name: "Millet", localNameSw: "Ulezi", category: "grain", unitBase: "kg", active: true },
  { id: "beans", name: "Beans", localNameSw: "Maharagwe", category: "legume", unitBase: "kg", active: true },
  { id: "ndengu", name: "Green Grams", localNameSw: "Ndengu", category: "legume", unitBase: "kg", active: true },
  { id: "sukuma", name: "Sukuma Wiki", localNameSw: "Sukuma Wiki", category: "vegetable", unitBase: "kg", active: true },
  { id: "tomatoes", name: "Tomatoes", localNameSw: "Nyanya", category: "vegetable", unitBase: "kg", active: true },
  { id: "potatoes", name: "Potatoes", localNameSw: "Viazi", category: "tuber", unitBase: "kg", active: true },
  { id: "cassava", name: "Cassava", localNameSw: "Mhogo", category: "tuber", unitBase: "kg", active: true },
];

export interface PriceRecord {
  marketId: string;
  marketName: string;
  cropType: string;
  rawPrice: number;
  rawUnit: string;
  normalizedPricePerKg: number;
  timestamp: number;
  source: "KilimoSTAT" | "UjuziKilimo";
}

export interface Bid {
  id: string;
  cropId: string;
  buyer: string;
  pricePerKg: number;
  quantity: string;
  location: string;
  timestamp: number;
}

export interface MarketSignal {
  cropType: string;
  averagePrice: number;
  trend: "upward" | "downward" | "stable";
  confidence: number; // 0-1
  changePercent: number;
  dataPoints: number;
  explanation?: {
    en: string;
    sw: string;
  };
}

// 3. Market Engine Logic
export function normalizePrice(price: number, unit: string): number {
  const weight = UNIT_WEIGHTS[unit.toLowerCase().replace("/", "").trim()] || 1;
  return Number((price / weight).toFixed(2));
}

export function calculateConfidence(records: PriceRecord[]): number {
  if (records.length === 0) return 0;
  
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  
  // Freshness factor
  const averageAge = records.reduce((acc, r) => acc + (now - r.timestamp), 0) / records.length;
  const freshnessScore = Math.max(0, 1 - averageAge / maxAge);
  
  // Volume factor
  const volumeScore = Math.min(1, records.length / 5); // 5+ data points is good
  
  return (freshnessScore * 0.7) + (volumeScore * 0.3);
}

export function detectOutliers(prices: number[]): number[] {
  if (prices.length < 3) return prices;
  const sorted = [...prices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length / 4)];
  const q3 = sorted[Math.floor(sorted.length * (3 / 4))];
  const iqr = q3 - q1;
  const min = q1 - 1.5 * iqr;
  const max = q3 + 1.5 * iqr;
  return prices.filter(p => p >= min && p <= max);
}

// 4. Quality -> Value Mapping
export function calculateValuation(basePricePerKg: number, grade: string): number {
  const multipliers: Record<string, number> = {
    "A": 1.0,
    "B": 0.88, // 85-90% range average
    "C": 0.75, // 70-80% range average
    "D": 0.50, // Baseline for low quality
  };
  return basePricePerKg * (multipliers[grade] || multipliers["D"]);
}
