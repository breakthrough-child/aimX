import axios from 'axios'

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL!
const API_KEY = process.env.MONNIFY_API_KEY!
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY!

// fetch auth token
export async function getMonnifyToken() {
  const { data } = await axios.post(`${MONNIFY_BASE_URL}/merchant/login`, {
    apiKey: API_KEY,
    secretKey: SECRET_KEY,
  })

  return data.responseBody.accessToken
}

// create virtual account for a swap
export async function createVirtualAccount({
  customerName,
  customerEmail,
  reference,
  amount
}: {
  customerName: string
  customerEmail: string
  reference: string
  amount: number
}) {
  const token = await getMonnifyToken()

  const { data } = await axios.post(
    `${MONNIFY_BASE_URL}/bank-transfer/reserved-accounts`,
    {
      accountReference: reference,
      accountName: customerName,
      customerEmail,
      contractCode: process.env.MONNIFY_CONTRACT_CODE!,
      customerName,
      amount,
      incomeSplitConfig: [],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return data.responseBody
}
