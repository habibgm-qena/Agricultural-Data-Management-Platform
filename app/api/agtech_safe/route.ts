import { NextRequest, NextResponse } from 'next/server';
import cpClient from '../cpClient';
import { setCustomerCache } from '../_customerCache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customerId = typeof body?.customerId === 'string' ? body.customerId.trim() : '';

    const backendRes = await cpClient.post('/agtech_safe/', body);

    if (customerId) {
      setCustomerCache(customerId, 'agtech_safe', body);
    }

    return NextResponse.json(backendRes.data ?? { ok: true }, { status: backendRes.status || 200 });
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const message = err?.response?.data || { message: err?.message || 'Internal error' };
    return NextResponse.json(message, { status });
  }
} 