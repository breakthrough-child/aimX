import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // basic validation (expand as needed)
  if (!body.coin || !body.bill || !body.address) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // you can store this order to a DB or external service here
  // for now we'll just log it
  console.log("New Order:", body);

  return NextResponse.json({ message: "Order placed successfully" }, { status: 200 });
}
