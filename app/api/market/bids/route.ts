
import { NextResponse } from 'next/server';
import { Bid } from '@/lib/market-engine';

const MOCK_BIDS: Bid[] = [
  { id: 'b1', cropId: 'maize', buyer: 'Kakamega Millers', pricePerKg: 46.5, quantity: '5000kg', location: 'Kakamega Central', timestamp: Date.now() },
  { id: 'b2', cropId: 'maize', buyer: 'Western Grains', pricePerKg: 47.0, quantity: '2000kg', location: 'Mumias', timestamp: Date.now() - 3600000 },
  { id: 'b3', cropId: 'beans', buyer: 'Lulu Legumes', pricePerKg: 102.0, quantity: '1000kg', location: 'Butere', timestamp: Date.now() },
  { id: 'b4', cropId: 'sukuma', buyer: 'Green Fresh Ltd', pricePerKg: 25.0, quantity: '500kg', location: 'Maraba', timestamp: Date.now() },
  { id: 'b5', cropId: 'beans', buyer: 'Wandiba Wholesalers', pricePerKg: 98.0, quantity: '3000kg', location: 'Kakamega', timestamp: Date.now() - 7200000 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cropId = searchParams.get('crop');

  if (!cropId) {
    return NextResponse.json({ error: "Crop parameter required" }, { status: 400 });
  }

  const filtered = MOCK_BIDS.filter(b => b.cropId.toLowerCase() === cropId.toLowerCase());
  
  return NextResponse.json(filtered);
}
