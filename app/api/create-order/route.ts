import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';
import { createVirtualAccount } from '@/app/api/lib/monnify';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { coin, amount, bill, walletAddress, customerName, customerEmail } = await req.json();

    if (!coin || !amount || !bill || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderReference = uuidv4();

    // Create virtual account via Monnify
    const virtualAccount = await createVirtualAccount(
      customerName || 'aimX user',
      customerEmail || 'noemail@aimx.com',
      orderReference,
      bill
    );

    // Save order in DB
    const newOrder = await prisma.order.create({
      data: {
        orderReference,
        coin,
        amount,
        bill,
        walletAddress,
        status: 'pending',
        virtualAccountNumber: virtualAccount.accountNumber,
        virtualAccountBank: virtualAccount.bankName,
      },
    });

    return NextResponse.json({
      order: newOrder,
      virtualAccount,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
