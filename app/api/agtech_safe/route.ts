import { NextRequest, NextResponse } from 'next/server';
import cpClient from '../cpClient';
import { setCustomerCache } from '../_customerCache';
import { setAgtechSectors, AgtechSector } from '../_agtechSectorsCache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerId = typeof body?.customerId === 'string' ? body.customerId.trim() : '';

    const backendRes = await cpClient.post('/agtech_safe/', body);

    if (customerId) {
      setCustomerCache(customerId, 'agtech_safe', body);

      const sectors: AgtechSector[] = [];
      if (Array.isArray(body?.livestock) && body.livestock.length > 0) sectors.push('Livestock');
      if (Array.isArray(body?.vegetable_production) && body.vegetable_production.length > 0) sectors.push('Vegetables');
      if (Array.isArray(body?.fishery) && body.fishery.length > 0) sectors.push('Fishery');
      if (Array.isArray(body?.fruit_veg_seedling) && body.fruit_veg_seedling.length > 0) sectors.push('Seedlings');
      if (Array.isArray(body?.seed_production) && body.seed_production.length > 0) sectors.push('Seed Prod.');
      if (Array.isArray(body?.apiculture) && body.apiculture.length > 0) sectors.push('Apiculture');
      if (Array.isArray(body?.poultry) && body.poultry.length > 0) sectors.push('Poultry');

      setAgtechSectors(customerId, sectors);
    }

    return NextResponse.json(backendRes.data ?? { ok: true }, { status: backendRes.status || 200 });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data || { message: err?.message || 'Internal error' };
    return NextResponse.json(message, { status });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = (searchParams.get('customerId') || '').trim();
    if (!customerId) return NextResponse.json({ message: 'customerId is required' }, { status: 400 });

    // Optional: we could recompute from cached payload, but we already store sectors explicitly
    const { getAgtechSectors } = await import('../_agtechSectorsCache');
    const sectors = getAgtechSectors(customerId) || [];
    return NextResponse.json({ customerId, sectors }, { status: 200 });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data || { message: err?.message || 'Internal error' };
    return NextResponse.json(message, { status });
  }
} 