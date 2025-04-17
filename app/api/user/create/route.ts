import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, wallet } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        wallet,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
