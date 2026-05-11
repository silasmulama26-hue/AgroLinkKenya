
import { NextResponse } from 'next/server';
import { CROP_REGISTRY } from '@/lib/market-engine';

export async function GET() {
  console.log('GET /api/market/crops called');
  return NextResponse.json(CROP_REGISTRY);
}
