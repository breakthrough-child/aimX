import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET() {
  try {
    // Get all pending swaps with no virtual account
    const pendingSwaps = await prisma.swap.findMany({
      where: {
        status: "pending",
        virtualAccount: null,
      },
    });

    if (pendingSwaps.length === 0) {
      return NextResponse.json({ message: "No pending swaps found." });
    }

    const createdAccounts = [];

    for (const swap of pendingSwaps) {
      // Simulating virtual account generation
      const virtualAccount = await prisma.virtualAccount.create({
        data: {
          accountName: `User for ${swap.id}`,
          accountNumber: `10${Math.floor(10000000 + Math.random() * 90000000)}`,
          bankName: "Wema Bank",
          swap: { connect: { id: swap.id } },
        },
      });

      createdAccounts.push(virtualAccount);
    }

    return NextResponse.json({
      message: "Virtual accounts created for pending swaps.",
      accounts: createdAccounts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
