import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customerEmail, customerName, customerRef } = await req.json();

  const contractCode = process.env.MONNIFY_CONTRACT_CODE!;
  console.log("✅ Contract Code:", contractCode);

  try {
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/monnify/token`, {
      method: "POST",
    });

    const { token } = await tokenRes.json();

    if (!token) {
      return NextResponse.json({ error: "Failed to retrieve token" }, { status: 500 });
    }

    const requestBody = {
      contractCode,
      accountReference: customerRef,
      accountName: customerName,
      customerEmail,
      currencyCode: "NGN",
      getAllAvailableBanks: true,
    };

    console.log("Request Body to Monnify:", requestBody);

    const accountRes = await fetch("https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await accountRes.json();

    if (data.requestSuccessful) {
      return NextResponse.json({ account: data.responseBody });
    } else {
      return NextResponse.json({ error: "Failed to create virtual account", details: data }, { status: 500 });
    }

  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
