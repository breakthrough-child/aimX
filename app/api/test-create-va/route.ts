import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET() {
  const swap = await prisma.swap.findUnique({
    where: { reference: 'test-ref-002' },
  });

  if (!swap) {
    return NextResponse.json({ message: "No swap found for reference test-ref-002" });
  }

  const virtualAccount = await prisma.virtualAccount.create({
    data: {
      accountName: 'John Doe',
      accountNumber: '1134795961',
      bankName: 'Wema bank',
      swap: { connect: { id: swap.id } },
    },
  });

  return NextResponse.json(virtualAccount);
}
