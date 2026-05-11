
import { NextResponse } from 'next/server';
import { calculateValuation } from '@/lib/market-engine';

export async function POST(request: Request) {
  const body = await request.json();
  const { grade, currentMarketPricePerKg, estimatedYieldKg } = body;

  const valuePerKg = calculateValuation(currentMarketPricePerKg, grade);
  const totalValue = valuePerKg * estimatedYieldKg;
  
  // Potential deductions or variations based on grade metrics
  const gradeImpact = ((1 - (valuePerKg / currentMarketPricePerKg)) * 100).toFixed(0);

  return NextResponse.json({
    grade,
    basePrice: currentMarketPricePerKg,
    projectedPricePerKg: valuePerKg,
    estimatedTotalValue: totalValue,
    gradeImpactPercent: gradeImpact,
    currency: "KES"
  });
}
