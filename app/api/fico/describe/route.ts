import { NextRequest, NextResponse } from 'next/server';
import { getCustomerCache } from '../../_customerCache';
import { getAgtechSectors } from '../../_agtechSectorsCache';
import { buildFicoDescribeUserPrompt, ficoDescribeSystemPrompt } from '@/lib/prompts/ficoDescribe';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();
    if (!customerId || typeof customerId !== 'string') {
      return NextResponse.json({ message: 'Invalid customerId' }, { status: 400 });
    }

    const id = customerId.trim();
    const sectors = getAgtechSectors(id) || [];
    const cache = getCustomerCache(id, 'agtech_safe') || {};

    const counts: Array<{ label: string; count: number }> = [];
    const addCount = (label: string, arr?: unknown[]) => {
      if (Array.isArray(arr) && arr.length > 0) counts.push({ label, count: arr.length });
    };
    addCount('Livestock items', cache?.livestock);
    addCount('Vegetable plots', cache?.vegetable_production);
    addCount('Fishery records', cache?.fishery);
    addCount('Seedlings', cache?.fruit_veg_seedling);
    addCount('Seed production items', cache?.seed_production);
    addCount('Apiculture records', cache?.apiculture);
    addCount('Poultry records', cache?.poultry);

    const userPrompt = buildFicoDescribeUserPrompt({
      customerId: id,
      sectors,
      latitude: typeof cache?.latitude === 'number' ? cache.latitude : undefined,
      longitude: typeof cache?.longitude === 'number' ? cache.longitude : undefined,
      counts,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Safe fallback when no key is configured
      const fallback = `Customer ${id}: ${sectors.length ? `Active sectors include ${sectors.join(', ')}. ` : ''}` +
        (typeof cache?.latitude === 'number' && typeof cache?.longitude === 'number'
          ? `Located near (${cache.latitude.toFixed(2)}, ${cache.longitude.toFixed(2)}). `
          : '') +
        (counts.length ? `Activity snapshot — ${counts.map(c => `${c.label}: ${c.count}`).join('; ')}.` : '');
      return NextResponse.json({ customerId: id, description: fallback.trim() });
    }

    // Lazy import to avoid bundling when unused
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ficoDescribeSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 180,
    } as any);

    const content = completion?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ customerId: id, description: content.trim() });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Internal error' }, { status: 500 });
  }
} 