import { NextResponse } from 'next/server';

// Mock store for quality reports
let qualityReports: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cropId = searchParams.get('cropId');
  
  let filtered = qualityReports;
  if (cropId) {
    filtered = qualityReports.filter(r => r.cropId === cropId);
  }
  
  return NextResponse.json(filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReport = {
      ...data,
      id: `qr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    qualityReports.push(newReport);
    return NextResponse.json(newReport);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
