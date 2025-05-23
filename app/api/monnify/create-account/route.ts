import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, customerName, customerEmail } = body;

    if (!reference || !customerName || !customerEmail) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const swap = await prisma.swap.findUnique({
      where: { reference },
    });

    console.log("Swap fetched:", swap);

    if (!swap) {
      return NextResponse.json(
        { message: "Swap not found for this reference." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.MONNIFY_BASE_URL!;
    const apiKey = process.env.MONNIFY_API_KEY!;
    const secretKey = process.env.MONNIFY_SECRET_KEY!;
    const contractCode = process.env.MONNIFY_CONTRACT_CODE!;

    const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

    console.log("About to create reserved account with payload:", {
        accountReference: reference,
        accountName: customerName,
        currencyCode: "NGN",
        contractCode,
        customerEmail,
        customerName,
      });

      

const authRes = await axios.post(
  `${baseUrl}/api/v1/auth/login`,
  {},
  {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  }
);


const token = authRes.data.responseBody.accessToken;

const accountRes = await axios.post(
  `${baseUrl}/api/v2/reserved-accounts`,
  {
    accountReference: reference,
    accountName: customerName,
    currencyCode: "NGN",
    contractCode,
    customerEmail,
    customerName,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


    console.log("Reserved account response:", accountRes.data);

    const accountDetails = accountRes.data.responseBody;

    const virtualAccount = await prisma.virtualAccount.create({
      data: {
        accountName: accountDetails.accountName,
        accountNumber: accountDetails.accountNumber,
        bankName: accountDetails.bankName,
        swap: { connect: { id: swap.id } },
      },
    });

    const swaps = await prisma.swap.findMany();
console.log(swaps);


    return NextResponse.json({ virtualAccount });
  } catch (error: any) {
    console.error("Monnify API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Something went wrong creating virtual account." },
      { status: 500 }
    );
  }
}
