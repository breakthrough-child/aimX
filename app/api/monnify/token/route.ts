import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.MONNIFY_API_KEY!;
  const secretKey = process.env.MONNIFY_SECRET_KEY!;

  const encodedKey = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  try {
    const res = await fetch("https://api.monnify.com/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.requestSuccessful) {
      return NextResponse.json({ token: data.responseBody.accessToken });
    } else {
      return NextResponse.json({ error: "Failed to retrieve token" }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
