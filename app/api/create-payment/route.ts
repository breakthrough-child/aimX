import pool from '@/app/api/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const { swap_id, reference, amount } = body

  const query = `
    INSERT INTO payments 
    (swap_id, reference, amount, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING *
  `
  const values = [swap_id, reference, amount]

  const { rows } = await pool.query(query, values)
  return NextResponse.json(rows[0])
}
