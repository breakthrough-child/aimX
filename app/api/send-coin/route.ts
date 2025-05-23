import { NextRequest, NextResponse } from 'next/server'
import { sendCoin } from '@/app/api/lib/sendCoin'
import pool from '@/app/api/lib/db'

export async function POST(req: NextRequest) {
    try {
      // secure internal call with secret key
      const authHeader = req.headers.get('x-internal-secret')
      if (authHeader !== process.env.INTERNAL_API_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  
      const { swapReference, network, recipient, amount } = await req.json()
  
      // confirm swap exists and is marked paid before sending coin
      const { rows } = await pool.query(
        `SELECT id, status FROM swaps WHERE reference = $1`,
        [swapReference]
      )
  
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Swap not found' }, { status: 404 })
      }
  
      const swap = rows[0]
  
      if (swap.status !== 'paid' && swap.status !== 'completed') {
        return NextResponse.json({ error: 'Swap not eligible for disbursement' }, { status: 400 })
      }
  
      // trigger coin send
      const result = await sendCoin({
        network,
        to: recipient,
        amount,
        swapId: swap.id
      })
  
      if (result.success) {
        await pool.query(
          `UPDATE swaps SET status = 'completed', updated_at = now() WHERE id = $1`,
          [swap.id]
        )
  
        return NextResponse.json({ message: 'Coin sent', txHash: result.txHash })
      } else {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
  
    } catch (error: any) {
      console.error('Send coin route error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
  