import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET() {
  const swap = await prisma.swap.create({
    data: {
      userId: 'e8234572-801e-4f59-906a-5b6075aa4dc9', // replace with a real userId from your DB or seed one
      coinType: 'BTC',
      amount: 2000,
      fee: 20,
      recipient: '0x123456789',
      reference: 'test-ref-003',
      status: 'pending',
    },
  });

  return NextResponse.json(swap);
}
