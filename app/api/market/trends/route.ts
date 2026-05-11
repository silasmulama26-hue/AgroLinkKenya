
import { NextResponse } from 'next/server';
import { calculateConfidence, PriceRecord, normalizePrice } from '@/lib/market-engine';

// Historical data for trend calculation
const HISTORICAL_SERIES: { crop: string; price: number; date: string }[] = [
  // Maize
  { crop: 'Maize', price: 4000, date: '2024-04-28' },
  { crop: 'Maize', price: 4100, date: '2024-04-29' },
  { crop: 'Maize', price: 4200, date: '2024-05-01' },
  { crop: 'Maize', price: 4250, date: '2024-05-03' },
  { crop: 'Maize', price: 4300, date: '2024-05-05' },
  // Beans
  { crop: 'Beans', price: 8500, date: '2024-04-28' },
  { crop: 'Beans', price: 8600, date: '2024-04-29' },
  { crop: 'Beans', price: 8800, date: '2024-05-01' },
  { crop: 'Beans', price: 9000, date: '2024-05-03' },
  { crop: 'Beans', price: 9200, date: '2024-05-05' },
  // Green Grams (Ndengu)
  { crop: 'Green Grams', price: 90, date: '2024-04-28' }, // per kg already? no, let's assume 90kg bag if unit isn't specified
  { crop: 'Green Grams', price: 9200, date: '2024-05-01' },
  { crop: 'Green Grams', price: 9400, date: '2024-05-05' },
  // Sukuma Wiki (often sold in crates/bags, normalized in records)
  { crop: 'Sukuma Wiki', price: 1800, date: '2024-05-01' },
  { crop: 'Sukuma Wiki', price: 2100, date: '2024-05-05' },
];

// Base prices per kg for categories if no history exists
const BASE_PRICES: Record<string, number> = {
  'Maize': 47,
  'Sorghum': 55,
  'Millet': 70,
  'Beans': 105,
  'Green Grams': 110,
  'Sukuma Wiki': 25,
  'Tomatoes': 45,
  'Potatoes': 35,
  'Cassava': 20,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop') || 'Maize';

  let normalizedSeries = HISTORICAL_SERIES
    .filter(s => s.crop.toLowerCase() === crop.toLowerCase())
    .map(s => normalizePrice(s.price, s.price < 500 ? 'kg' : '90kg bag'));

  // If no history, generate a stable baseline
  if (normalizedSeries.length === 0) {
    const base = BASE_PRICES[crop] || 50;
    normalizedSeries = [base * 0.98, base * 0.99, base];
  }
  
  const currentPrice = normalizedSeries[normalizedSeries.length - 1];
  const lastPrice = normalizedSeries[normalizedSeries.length - 2] || currentPrice * 0.99;
  
  const changePercent = lastPrice !== 0 ? ((currentPrice - lastPrice) / lastPrice) * 100 : 0;
  
  let trend: 'upward' | 'downward' | 'stable' = 'stable';
  if (changePercent > 0.5) trend = 'upward';
  else if (changePercent < -0.5) trend = 'downward';

  // Calculate 7-day average
  const avg7Day = normalizedSeries.length > 0 
    ? normalizedSeries.reduce((a, b) => a + b, 0) / normalizedSeries.length 
    : currentPrice;

  return NextResponse.json({
    crop,
    currentPrice: Number(currentPrice.toFixed(1)),
    avg7Day: Number(avg7Day.toFixed(1)),
    trend,
    changePercent: Number(changePercent.toFixed(2)),
    confidence: normalizedSeries.length > 3 ? 0.85 : 0.65,
    lastUpdate: Date.now()
  });
}
