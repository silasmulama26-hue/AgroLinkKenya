import { NextResponse } from 'next/server';
import { CROP_REGISTRY, normalizePrice } from '@/lib/market-engine';

// Mock historical data generator
const getMockTrends = (cropName: string, rangeDays: number = 7) => {
  const base = {
    'Maize': 47,
    'Sorghum': 55,
    'Millet': 72,
    'Beans': 105,
    'Green Grams': 112,
    'Sukuma Wiki': 28,
    'Tomatoes': 42,
    'Potatoes': 36,
    'Cassava': 22,
  }[cropName] || 50;

  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  
  // Generate historical price data based on range
  const history = Array.from({ length: rangeDays }, (_, i) => {
    const day = (rangeDays - 1) - i; 
    const date = new Date();
    date.setDate(date.getDate() - day);
    
    // Seasonal variations simulated
    const seasonality = Math.sin((date.getMonth() + date.getDate() / 30) * Math.PI / 6) * 5;
    const price = Number((base + seasonality + (Math.random() * 4 - 2)).toFixed(1));
    const comparePrice = Number((base + seasonality - 2 + (Math.random() * 4 - 2)).toFixed(1));

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price,
      comparePrice: comparePrice, // Mock comparison data (e.g., Regional Average)
    };
  });

  const currentPrice = history[history.length - 1].price;
  const avgPeriod = Number((history.reduce((acc, h) => acc + h.price, 0) / rangeDays).toFixed(1));
  const changePercent = Number((((currentPrice - history[0].price) / history[0].price) * 100).toFixed(2));
  
  return {
    currentPrice,
    avg7Day: avgPeriod,
    trend: changePercent > 0.5 ? 'upward' : changePercent < -0.5 ? 'downward' : 'stable',
    changePercent,
    bidCount: Math.floor(rand(1, 10)),
    history
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cropsParam = searchParams.get('crops');
  const range = parseInt(searchParams.get('range') || '7');

  if (!cropsParam) {
    return NextResponse.json({ error: "No crops specified" }, { status: 400 });
  }

  const cropIds = cropsParam.split(',');
  const results = cropIds.map(id => {
    const crop = CROP_REGISTRY.find(c => c.id === id);
    if (!crop) return null;
    
    return {
      id,
      name: crop.name,
      localNameSw: crop.localNameSw,
      ...getMockTrends(crop.name, range)
    };
  }).filter(Boolean);

  // Simulated delay
  await new Promise(r => setTimeout(r, 600));

  return NextResponse.json(results);
}
