import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import AimXTokenSender from "@/app/api/lib/contracts/AimXTokenSender.json"; // move your ABI here or adjust path

//dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const recipientAddress = body.walletAddress;
    const amount = body.amountPaid;

    if (!recipientAddress || !amount) {
      return NextResponse.json(
        { error: "Missing walletAddress or amountPaid in request" },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

    const tokenSenderContract = new ethers.Contract(
      process.env.AIMX_TOKEN_SENDER_CONTRACT!,
      AimXTokenSender.abi,
      wallet
    );

    const tx = await tokenSenderContract.sendToken(
      process.env.AIMX_TOKEN_CONTRACT!,
      recipientAddress,
      ethers.parseUnits(amount, 18) // token decimals assumed 18
    );

    await tx.wait();

    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (error: any) {
    console.error("Token transfer failed:", error);
    return NextResponse.json(
      { error: "Token transfer failed", details: error.message },
      { status: 500 }
    );
  }
}
