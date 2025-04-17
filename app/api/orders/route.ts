// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("Received order:", body);

  // Here you'd save to your DB in a real app — for now, we’ll just return it
  return NextResponse.json({ message: "Order received", order: body });
}
