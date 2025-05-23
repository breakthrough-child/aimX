import pool from '@/app/api/lib/db'
import { NextResponse } from 'next/server'
import { createVirtualAccount } from '@/app/api/lib/monnnify'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    user_id, coin_type, network, amount, fee, recipient, reference, customerName, customerEmail
  } = body

  const query = `
    INSERT INTO swaps 
    (user_id, coin_type, network, amount, fee, recipient, reference, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
    RETURNING *
  `
  const values = [user_id, coin_type, network, amount, fee, recipient, reference]

  const { rows } = await pool.query(query, values)
  const swap = rows[0]

  // call Monnify to create virtual account
  const vAccount = await createVirtualAccount({
    customerName,
    customerEmail,
    reference,
    amount: Number(amount),
  })

  // insert virtual account record
  await pool.query(
    `INSERT INTO virtual_accounts 
    (account_name, account_number, bank_name, swap_id)
    VALUES ($1, $2, $3, $4)`,
    [vAccount.accountName, vAccount.accountNumber, vAccount.bankName, swap.id]
  )

  return NextResponse.json({
    swap,
    virtualAccount: vAccount
  })
}
