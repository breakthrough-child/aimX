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

    // fetch all failed transactions
    const { rows } = await pool.query(
      `SELECT id, swap_id, response FROM swap_transactions WHERE status = 'failed'`
    )

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No failed transactions found' })
    }

    const results = []

    for (const tx of rows) {
      // fetch swap details
      const swapRes = await pool.query(
        `SELECT reference, status, recipient, amount, network FROM swaps WHERE id = $1`,
        [tx.swap_id]
      )

      if (swapRes.rows.length === 0) {
        results.push({ swapId: tx.swap_id, error: 'Swap not found' })
        continue
      }

      const swap = swapRes.rows[0]

      if (swap.status !== 'paid' && swap.status !== 'completed') {
        results.push({ swapId: tx.swap_id, error: 'Swap not eligible for retry' })
        continue
      }

      // retry sending coin
      const result = await sendCoin({
        network: swap.network,
        to: swap.recipient,
        amount: swap.amount,
        swapId: tx.swap_id
      })

      if (result.success) {
        await pool.query(
          `UPDATE swaps SET status = 'completed', updated_at = now() WHERE id = $1`,
          [tx.swap_id]
        )
      }

      results.push({
        swapId: tx.swap_id,
        success: result.success,
        txHash: result.txHash || null,
        error: result.success ? null : result.error
      })
    }

    return NextResponse.json({ message: 'Retries processed', results })

  } catch (error: any) {
    console.error('Retry handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
