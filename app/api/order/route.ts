import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, amount } = data;

    if (!userId || !amount) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const order = await prisma.payment.create({
      data: {
        orderId: userId,
        amount,
        paymentReference: `ref_${Date.now()}`,
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
