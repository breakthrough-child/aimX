import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, coinType, amount, fee, recipient } = body;

  const reference = uuidv4();

  const swap = await prisma.swap.create({
    data: {
      userId,
      coinType,
      amount,
      fee,
      recipient,
      reference,  // add this
      status: "pending",
      virtualAccountId: null,
    },
  });
  

  return NextResponse.json({ swap, reference });
}
