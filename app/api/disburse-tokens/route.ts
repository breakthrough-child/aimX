import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import { ethers } from "ethers";
import AimXTokenSender from "@/app/api/lib/contracts/AimXTokenSender.json";

export async function POST(req: NextRequest) {
  try {
    const { swapId } = await req.json();

    const swap = await prisma.swap.findUnique({
      where: { id: swapId },
      include: { virtualAccount: true },
    });

    if (!swap) {
      return NextResponse.json({ error: "Swap order not found" }, { status: 404 });
    }

    if (swap.status !== "pending") {
      return NextResponse.json({ error: "Swap already processed" }, { status: 400 });
    }

    // Send tokens through blockchain
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    const tokenSenderContract = new ethers.Contract(
      process.env.AIMX_TOKEN_SENDER_CONTRACT!,
      AimXTokenSender.abi,
      wallet
    );

    const tx = await tokenSenderContract.sendToken(
      process.env.AIMX_TOKEN_CONTRACT!,
      swap.recipient,
      ethers.parseUnits(swap.amount.toString(), 18)
    );

    await tx.wait();

    // Mark swap as completed
    await prisma.swap.update({
      where: { id: swap.id },
      data: { status: "completed" },
    });

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error: any) {
    console.error("Token disbursement failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
