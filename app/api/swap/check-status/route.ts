import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import { sendCoinToRecipient } from "@/app/api/lib/blockchain/sendcoin";
import { ethers } from "ethers";
import { Payment, Swap } from "@prisma/client";

export async function GET() {
  const pendingSwaps = await prisma.swap.findMany({
    where: { status: "pending" },
  });

  for (const swap of pendingSwaps) {
    const isPaid = await checkPaymentStatus(swap);

    if (isPaid) {
      await sendCoinToRecipient(swap.recipient, swap.amount.toString());
      await prisma.swap.update({
        where: { id: swap.id },
        data: { status: "fulfilled" },
      });
    }
  }

  return NextResponse.json({ message: "Checked swaps." });
}

async function checkPaymentStatus(swap: Swap) {
  const payment = await prisma.payment.findUnique({
    where: { reference: swap.reference }, // ⬅️ reference not id!
  });

  return payment?.status === "paid";
}
