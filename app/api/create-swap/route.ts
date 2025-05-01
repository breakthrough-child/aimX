import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const swap = await prisma.swap.create({
      data: {
        userId: body.userId,
        coinType: body.coinType,
        network: body.network,
        amount: body.amount,
        fee: body.fee,
        recipient: body.recipient,
        reference: body.reference,
        status: 'pending',
      },
    })

    return NextResponse.json(swap, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create swap' }, { status: 500 })
  }
}
