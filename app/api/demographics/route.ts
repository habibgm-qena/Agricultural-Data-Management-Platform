import { NextRequest, NextResponse } from 'next/server';
import cpClient from '../cpClient';
import { setCustomerCache } from '../_customerCache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: Array<{ customerId?: string }> = Array.isArray(body?.demographics)
      ? body.demographics
      : [];

    const customerIds = new Set<string>();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item && typeof item.customerId === 'string' && item.customerId.trim()) {
        customerIds.add(item.customerId.trim());
      }
    }

    const backendRes = await cpClient.post('/demographics/', body);

    customerIds.forEach((id) => {
      setCustomerCache(id, 'demographics', body);
    });

    return NextResponse.json(backendRes.data ?? { ok: true }, { status: backendRes.status || 200 });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data || { message: err?.message || 'Internal error' };
    return NextResponse.json(message, { status });
  }
} 