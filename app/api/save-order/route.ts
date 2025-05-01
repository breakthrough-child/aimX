import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      userId,
      coinType,
      amount,
      fee,
      recipient,
      reference,
      accountName,
      accountNumber,
      bankName,
    } = data;

    if (!userId || !coinType || !amount || !fee || !recipient || !reference || !accountName || !accountNumber || !bankName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const swap = await prisma.swap.create({
      data: {
        userId,
        coinType,
        amount,
        fee,
        recipient,
        reference,
        status: 'pending',
      },
    });

    const virtualAccount = await prisma.virtualAccount.create({
      data: {
        accountName,
        accountNumber,
        bankName,
        swap: { connect: { id: swap.id } },
      },
    });

    return NextResponse.json({ success: true, swap, virtualAccount }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
