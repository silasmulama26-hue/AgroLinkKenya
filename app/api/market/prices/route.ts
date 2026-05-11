
import { NextResponse } from 'next/server';
import { PriceRecord, normalizePrice, detectOutliers } from '@/lib/market-engine';

// Mocked Historical Data from KilimoSTAT & UjuziKilimo for Kakamega
const MOCK_DATA: Omit<PriceRecord, 'normalizedPricePerKg'>[] = [
  { marketId: 'mk1', marketName: 'Kakamega Central', cropType: 'Maize', rawPrice: 4200, rawUnit: '90kg bag', timestamp: Date.now() - 100000, source: 'KilimoSTAT' },
  { marketId: 'mk1', marketName: 'Kakamega Central', cropType: 'Maize', rawPrice: 4300, rawUnit: '90kg bag', timestamp: Date.now() - 200000, source: 'UjuziKilimo' },
  { marketId: 'mk2', marketName: 'Mumias', cropType: 'Maize', rawPrice: 4100, rawUnit: '90kg bag', timestamp: Date.now() - 300000, source: 'KilimoSTAT' },
  { marketId: 'mk1', marketName: 'Kakamega Central', cropType: 'Beans', rawPrice: 9000, rawUnit: '90kg bag', timestamp: Date.now() - 50000, source: 'KilimoSTAT' },
  // Outlier example
  { marketId: 'mk1', marketName: 'Kakamega Central', cropType: 'Maize', rawPrice: 15000, rawUnit: '90kg bag', timestamp: Date.now() - 400000, source: 'UjuziKilimo' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const crop = searchParams.get('crop');

  let filtered = MOCK_DATA;
  if (crop) {
    filtered = MOCK_DATA.filter(d => d.cropType.toLowerCase() === crop.toLowerCase());
  }

  const normalized = filtered.map(d => ({
    ...d,
    normalizedPricePerKg: normalizePrice(d.rawPrice, d.rawUnit)
  })) as PriceRecord[];

  // Data Quality Layer: Filter Outliers
  const pricesOnly = normalized.map(n => n.normalizedPricePerKg);
  const validPrices = detectOutliers(pricesOnly);
  const cleaned = normalized.filter(n => validPrices.includes(n.normalizedPricePerKg));

  return NextResponse.json({
    records: cleaned,
    totalRemoved: normalized.length - cleaned.length,
    timestamp: Date.now()
  });
}
