import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {

    console.log({
        MONNIFY_BASE_URL: process.env.MONNIFY_BASE_URL,
        MONNIFY_API_KEY: process.env.MONNIFY_API_KEY,
        MONNIFY_SECRET_KEY: process.env.MONNIFY_SECRET_KEY,
      });
      

    const baseUrl = process.env.MONNIFY_BASE_URL!;
    const apiKey = process.env.MONNIFY_API_KEY!;
    const secretKey = process.env.MONNIFY_SECRET_KEY!;

    const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    const response = await axios.post(
      `${baseUrl}/api/v1/auth/login`,
      {},
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Monnify login test error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
