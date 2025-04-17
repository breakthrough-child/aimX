import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import { releaseCrypto } from "@/app/api/lib/release-crypto";

export async function POST(req: Request) {
  const body = await req.json();

  const { reference, paymentStatus } = body;

  if (paymentStatus !== "PAID") {
    return NextResponse.json({ message: "Payment not successful, ignoring." });
  }

  // Find swap record
  const swap = await prisma.swap.findUnique({
    where: { reference },
  });

  if (!swap) {
    return NextResponse.json({ message: "No swap found for reference." });
  }

  // Update swap status
  await prisma.swap.update({
    where: { reference },
    data: { status: "confirmed" },
  });

  // Trigger smart contract call to release crypto
  const release = await releaseCrypto(swap.recipient, swap.amount, swap.coinType);

  if (!release.success) {
    return NextResponse.json({ message: "Crypto release failed.", error: release.error });
  }

  return NextResponse.json({ message: "Swap confirmed and crypto released.", txHash: release.txHash });
}
