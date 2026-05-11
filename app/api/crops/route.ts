import { NextResponse } from 'next/server';
import { UserCrop } from '@/lib/market-engine';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase';

// Change: Fallback to mock in-memory store if Supabase is not configured
let mockedUserCrops: UserCrop[] = [
  {
    id: 'uc1',
    cropId: 'maize',
    area: 2.5,
    stage: 'growing',
    plantedAt: '2024-03-15',
    trackMarket: true,
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'uc2',
    cropId: 'beans',
    area: 1.0,
    stage: 'growing',
    trackMarket: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'uc3',
    cropId: 'tomatoes',
    area: 0.5,
    stage: 'harvesting',
    trackMarket: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  console.log('GET /api/crops called');
  if (isSupabaseConfigured()) {
    try {
      console.log('Supabase is configured, attempting to fetch user_crops...');
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('user_crops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to mock:', error.message);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} crops from Supabase`);
      const mappedData = data.map((item: any) => ({
        ...item,
        cropId: item.crop_id,
        plantedAt: item.planted_at,
        trackMarket: item.track_market,
        isFavorite: item.is_favorite,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      return NextResponse.json(mappedData || []);
    } catch (err: any) {
      console.error('API Error in /api/crops GET:', err);
      // Fallback to mock if database query fails (e.g. table not created)
      return NextResponse.json(mockedUserCrops);
    }
  }
  console.log('Supabase not configured, returning mock crops');
  return NextResponse.json(mockedUserCrops);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: newCrop, error } = await supabase
        .from('user_crops')
        .insert([{
          crop_id: data.cropId,
          area: data.area,
          stage: data.stage,
          planted_at: data.plantedAt,
          track_market: data.trackMarket ?? true,
          is_favorite: data.isFavorite ?? false,
        }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(newCrop);
    } catch (err: any) {
      if (err?.code !== 'PGRST205' && err?.code !== '42P01') {
        console.error('Supabase insert error:', {
          code: err?.code,
          message: err?.message,
          details: err?.details,
          hint: err?.hint
        });
      }
    }
  }

  const newCrop: UserCrop = {
    ...data,
    id: `uc${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockedUserCrops.push(newCrop);
  return NextResponse.json(newCrop);
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const { id, ...updates } = data;
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data: updated, error } = await supabase
        .from('user_crops')
        .update({
          ...(updates.cropId && { crop_id: updates.cropId }),
          ...(updates.area !== undefined && { area: updates.area }),
          ...(updates.stage && { stage: updates.stage }),
          ...(updates.plantedAt && { planted_at: updates.plantedAt }),
          ...(updates.trackMarket !== undefined && { track_market: updates.trackMarket }),
          ...(updates.isFavorite !== undefined && { is_favorite: updates.isFavorite }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const mappedUpdated = {
        ...updated,
        cropId: updated.crop_id,
        plantedAt: updated.planted_at,
        trackMarket: updated.track_market,
        isFavorite: updated.is_favorite,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at
      };
      return NextResponse.json(mappedUpdated);
    } catch (err: any) {
      if (err?.code !== 'PGRST205' && err?.code !== '42P01') {
        console.error('Supabase update error:', {
          code: err?.code,
          message: err?.message,
          details: err?.details,
          hint: err?.hint
        });
      }
    }
  }
  
  mockedUserCrops = mockedUserCrops.map(c => 
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  
  const updated = mockedUserCrops.find(c => c.id === id);
  if (!updated) {
    return NextResponse.json({ error: "Crop not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('user_crops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    } catch (err: any) {
      if (err?.code !== 'PGRST205' && err?.code !== '42P01') {
        console.error('Supabase delete error:', {
          code: err?.code,
          message: err?.message,
          details: err?.details,
          hint: err?.hint
        });
      }
    }
  }
  
  mockedUserCrops = mockedUserCrops.filter(c => c.id !== id);
  return NextResponse.json({ success: true });
}
