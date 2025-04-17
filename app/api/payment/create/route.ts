import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, amount } = body;

    if (!reference || !amount) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        reference,
        amount,
        status: "pending",
      },
    });

    return NextResponse.json({ payment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
