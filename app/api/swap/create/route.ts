import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import crypto from "crypto";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, coinType, amount, fee, recipient } = body;

    if (!userId || !coinType || !amount || !fee || !recipient) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const swap = await prisma.swap.create({
      data: {
        userId,
        coinType,
        amount,
        fee,
        recipient,
        reference: crypto.randomUUID(), // Generate a reference
      },
    });

    return NextResponse.json({ swap });
} catch (error: any) {
    console.error("Error creating swap:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
  
}
