import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import { sendCoinToRecipient } from "@/app/api/lib/blockchain/sendcoin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, eventData } = body;

    console.log("Received Monnify webhook event:", eventType, eventData);

    if (eventType === "SUCCESSFUL_TRANSACTION" && eventData.paymentStatus === "PAID") {
      const payment = await prisma.payment.findUnique({
        where: { reference: eventData.paymentReference },
      });

      if (!payment) {
        console.warn("Payment not found for reference:", eventData.paymentReference);
        return NextResponse.json(
          { message: "Payment record not found." },
          { status: 404 }
        );
      }

      await prisma.payment.update({
        where: { reference: eventData.paymentReference },
        data: { status: "paid", amount: eventData.amountPaid },
      });

      const swap = await prisma.swap.findUnique({
        where: { id: eventData.paymentReference },
      });

      if (swap) {
        await sendCoinToRecipient(swap.recipient, swap.amount.toString());

        await prisma.swap.update({
          where: { id: swap.id },
          data: { status: "fulfilled" },
        });
      } else {
        console.warn("Swap not found for reference:", eventData.paymentReference);
      }
    }

    return NextResponse.json({ message: "Webhook received successfully." });
  } catch (error) {
    console.error("Monnify Webhook handler error:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
