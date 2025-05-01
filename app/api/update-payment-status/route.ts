import pool from '@/app/api/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const { reference, status } = body

  const query = `
    UPDATE payments 
    SET status = $1, updated_at = now()
    WHERE reference = $2
    RETURNING *
  `
  const values = [status, reference]

  const { rows } = await pool.query(query, values)
  return NextResponse.json(rows[0])
}
