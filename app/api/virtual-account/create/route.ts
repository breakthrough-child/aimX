import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { swapId, accountName } = body;
  
      const swap = await prisma.swap.findUnique({
        where: { id: swapId },
      });
  
      if (!swap) {
        return NextResponse.json(
          { message: "Swap not found for provided swapId." },
          { status: 404 }
        );
      }
  
      const fakeResponse = {
        accountNumber: "1234567890",
        bankName: "Monnify Test Bank",
      };
  
      console.log("Creating virtual account with:", {
        accountName,
        accountNumber: fakeResponse.accountNumber,
        bankName: fakeResponse.bankName,
        swapId,
      });
  
      const virtualAccount = await prisma.virtualAccount.create({
        data: {
          accountName,
          accountNumber: fakeResponse.accountNumber,
          bankName: fakeResponse.bankName,
          swap: {
            connect: {
              id: swapId,
            },
          },
        },
      });
  
      await prisma.swap.update({
        where: { id: swapId },
        data: {
          virtualAccountId: virtualAccount.id,
        },
      });
  
      return NextResponse.json({ virtualAccount });
  
    } catch (error: any) {
      console.error("Error creating virtual account:", error);
      return NextResponse.json(
        { message: error.message || "Something went wrong creating virtual account." },
        { status: 500 }
      );
    }
  }
