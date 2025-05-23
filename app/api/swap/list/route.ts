import { NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function GET() {
  const swaps = await prisma.swap.findMany();
  return NextResponse.json({ swaps });
}