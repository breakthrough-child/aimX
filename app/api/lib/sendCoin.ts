import { ethers } from 'ethers'
import pool from '@/app/api/lib/db'

const NETWORK_RPC_URLS: Record<string, string> = {
  ethereum: process.env.ETHEREUM_RPC_URL!,
  bsc: process.env.BSC_RPC_URL!,
  polygon: process.env.POLYGON_RPC_URL!
}

const PRIVATE_KEYS: Record<string, string> = {
  ethereum: process.env.ETHEREUM_WALLET_PRIVATE_KEY!,
  bsc: process.env.BSC_WALLET_PRIVATE_KEY!,
  polygon: process.env.POLYGON_WALLET_PRIVATE_KEY!
}

export async function sendCoin({
  network,
  to,
  amount,
  swapId
}: {
  network: 'ethereum' | 'bsc' | 'polygon'
  to: string
  amount: string // in ETH, BNB, MATIC string format
  swapId: string
}) {
  try {
    const rpcUrl = NETWORK_RPC_URLS[network]
    const privateKey = PRIVATE_KEYS[network]

    if (!rpcUrl || !privateKey) {
      throw new Error(`Missing RPC URL or private key for network: ${network}`)
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(privateKey, provider)

    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    })

    await pool.query(
      `INSERT INTO swap_transactions (swap_id, tx_hash, status, response)
       VALUES ($1, $2, $3, $4)`,
      [swapId, tx.hash, 'pending', JSON.stringify(tx)]
    )

    const receipt = await tx.wait()

    await pool.query(
      `UPDATE swap_transactions SET status = $1, response = $2, created_at = now() WHERE tx_hash = $3`,
      ['confirmed', JSON.stringify(receipt), tx.hash]
    )

    return { success: true, txHash: tx.hash, receipt }
  } catch (error: any) {
    console.error('Coin send failed:', error)

    await pool.query(
      `INSERT INTO swap_transactions (swap_id, status, response)
       VALUES ($1, $2, $3)`,
      [swapId, 'failed', JSON.stringify({ error: error.message })]
    )

    return { success: false, error: error.message }
  }
}
