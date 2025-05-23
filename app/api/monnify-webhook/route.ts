import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/api/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('monnify-signature') || ''
  const secret = process.env.MONNIFY_WEBHOOK_SECRET_KEY!
  const event = JSON.parse(rawBody)
  const eventType = event.eventType || 'unknown'

  // verify Monnify signature
  const expectedSignature = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex')

  const signatureValid = signature === expectedSignature

  // log webhook attempt
  await pool.query(
    `INSERT INTO webhook_logs (event_type, raw_payload, status, signature_valid)
     VALUES ($1, $2, $3, $4)`,
    [eventType, event, 'received', signatureValid]
  )

  if (!signatureValid) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
  }

  // handle successful payment notification
  if (eventType === 'SUCCESSFUL_TRANSACTION') {
    const {
      product: swapReference,
      paymentReference,
      paidAmount,
      paymentStatus
    } = event.eventData

    // update payment status
    await pool.query(
      `UPDATE payments SET status = $1, amount = $2, updated_at = now() WHERE reference = $3`,
      [paymentStatus.toLowerCase(), paidAmount, paymentReference]
    )

    // if payment confirmed, also update linked swap record
    if (paymentStatus === 'PAID') {
      await pool.query(
        `UPDATE swaps SET status = 'completed', payment_confirmed_at = now() WHERE reference = $1`,
        [swapReference]
      )
    }

    // trigger coin send after payment is confirmed
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-coin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': process.env.INTERNAL_API_SECRET!
        },
        body: JSON.stringify({
          swapReference,
          network: event.eventData.paymentMethod,
          recipient: event.eventData.customerEmail,
          amount: paidAmount
        })
      })
      
  
  }

  return NextResponse.json({ message: 'Webhook processed' }, { status: 200 })
}
