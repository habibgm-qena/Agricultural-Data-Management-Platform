import { NextRequest, NextResponse } from "next/server";
import cpClient from "../cpClient";

export async function POST(req: NextRequest) {
	try {
		const { customerId } = await req.json();
		if (!customerId || typeof customerId !== "string") {
			return new NextResponse("Invalid customerId", { status: 400 });
		}

		// Example backend endpoint. Adjust path if needed
		const response = await cpClient.post(`/api/v1/fico/score/`, { customerId });

		// Expecting an array of { name, score } from backend, otherwise map accordingly
		const data = Array.isArray(response?.data) ? response.data : response?.data?.data ?? [];
		return NextResponse.json(data, { status: 200 });
	} catch (err: any) {
		const message = err?.response?.data?.message || err?.message || "Internal error";
		return new NextResponse(message, { status: err?.response?.status || 500 });
	}
} 