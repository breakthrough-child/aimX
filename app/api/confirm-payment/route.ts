import { NextRequest, NextResponse } from "next/server";
import { sendCoinToRecipient } from "../lib/blockchain/sendcoin";

export async function POST(req: NextRequest) {
  const { recipient, amount } = await req.json();

  try {
    const txHash = await sendCoinToRecipient(recipient, amount);
    return NextResponse.json({ success: true, txHash });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
