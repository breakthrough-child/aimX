import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET() {
  const user = await prisma.user.create({
    data: {
      email: "testuser2@example.com",
    },
  });

  console.log("User created:", user);
  return NextResponse.json(user);
}
