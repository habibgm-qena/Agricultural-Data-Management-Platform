import { NextRequest, NextResponse } from "next/server";
import { getAgtechSectors } from "../_agtechSectorsCache";

function randomScore(min = 300, max = 800) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();
    if (!customerId || typeof customerId !== "string") {
      return new NextResponse("Invalid customerId", { status: 400 });
    }

    const sectors = getAgtechSectors(customerId.trim()) || [];

    // If no sectors cached, return a single Overall score
    if (!sectors.length) {
      return NextResponse.json([
        { name: "Overall", score: randomScore() },
      ]);
    }

    const data = sectors.map((name) => ({ name, score: randomScore() }));
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const message = err?.message || "Internal error";
    return new NextResponse(message, { status: 500 });
  }
} 