import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		// const body = await request.json();
		// const { customerId } = body || {};

		// if (!customerId || typeof customerId !== 'string' || customerId.trim().length === 0) {
		// 	return new NextResponse('Invalid customerId', { status: 400 });
		// }

		// // Mock: derive a deterministic score from the customerId for demo purposes
		// const normalized = customerId.trim().toLowerCase();
		// let hash = 0;
		// for (let i = 0; i < normalized.length; i++) {
		// 	hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
		// }
		// const baseScore = (hash % 300) + 50; // 50 - 349

		// const data = [
		// 	{ score: Math.max(0, Math.min(350, Math.round(baseScore))), name: 'fico apiculture' },
		// 	{ score: Math.max(0, Math.min(350, Math.round(baseScore * 0.75))), name: 'fico livestock' },
		// 	{ score: Math.max(0, Math.min(350, Math.round(baseScore * 0.55))), name: 'fico crops' },
		// ];

		// return NextResponse.json(data, { status: 200 });
    const data = [
      { score: 300, name: 'fico apiculture' },
      { score: 250, name: 'fico livestock' },
      { score: 200, name: 'fico crops' },
    ]
    return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return new NextResponse('Failed to process request', { status: 500 });
	}
} 