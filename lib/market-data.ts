
import { PriceRecord, Bid } from './market-engine';

export interface MarketHistory {
  date: string;
  price: number;
  market: string;
}

export const MARKETS = [
  { id: 'wakulima', name: 'Wakulima', county: 'Nairobi', region: 'Central' },
  { id: 'muthurwa', name: 'Muthurwa', county: 'Nairobi', region: 'Central' },
  { id: 'kongowea', name: 'Kongowea', county: 'Mombasa', region: 'Coast' },
  { id: 'kibuye', name: 'Kibuye', county: 'Kisumu', region: 'Nyanza' },
  { id: 'municipal', name: 'Nakuru Municipal', county: 'Nakuru', region: 'Rift Valley' },
  { id: 'eldoret', name: 'Eldoret Main', county: 'Uasin Gishu', region: 'Rift Valley' },
];

// Helper to generate history
function generateHistory(basePrice: number, volatility: number, days: number = 30): any[] {
  const history = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const price = basePrice + (Math.random() - 0.5) * volatility;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price)
    });
  }
  return history;
}

export const REGION_CROP_PRICES: Record<string, any> = {
  'Maize': {
    'Central': 42,
    'Coastal': 48,
    'Nyanza': 45,
    'Rift Valley': 38,
    'Eastern': 44
  },
  'Beans': {
    'Central': 110,
    'Coastal': 125,
    'Nyanza': 115,
    'Rift Valley': 105,
    'Eastern': 112
  },
  'Tomatoes': {
    'Central': 60,
    'Coastal': 95,
    'Nyanza': 80,
    'Rift Valley': 65,
    'Eastern': 85
  }
};

export const MOCK_BIDS: Bid[] = [
  { id: 'b1', cropId: 'maize', buyer: 'NCPB Nakuru', pricePerKg: 39, quantity: '500 Bags', location: 'Nakuru', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
  { id: 'b2', cropId: 'maize', buyer: 'Unga Limited', pricePerKg: 43, quantity: '2000 Bags', location: 'Nairobi', timestamp: Date.now() - 1000 * 60 * 60 * 5 },
  { id: 'b3', cropId: 'maize', buyer: 'Pembe Millers', pricePerKg: 41, quantity: '1200 Bags', location: 'Eldoret', timestamp: Date.now() - 1000 * 60 * 60 * 12 },
  { id: 'b4', cropId: 'beans', buyer: 'School Feeding Program', pricePerKg: 115, quantity: '100 Bags', location: 'Kisumu', timestamp: Date.now() - 1000 * 60 * 60 * 1 },
  { id: 'b5', cropId: 'tomatoes', buyer: 'Mombasa Fresh', pricePerKg: 95, quantity: '50 Crates', location: 'Mombasa', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
];
