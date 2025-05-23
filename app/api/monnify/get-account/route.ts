import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { message: "Reference is required." },
        { status: 400 }
      );
    }

    const swap = await prisma.swap.findUnique({
      where: { reference },
      include: { virtualAccount: true },
    });

    if (!swap) {
      return NextResponse.json(
        { message: "Swap not found for this reference." },
        { status: 404 }
      );
    }

    if (!swap.virtualAccount) {
      return NextResponse.json(
        { message: "No virtual account found for this swap." },
        { status: 404 }
      );
    }

    return NextResponse.json({ virtualAccount: swap.virtualAccount });
  } catch (error: any) {
    console.error("Error fetching virtual account:", error.message);
    return NextResponse.json(
      { message: "Something went wrong fetching virtual account." },
      { status: 500 }
    );
  }
}
