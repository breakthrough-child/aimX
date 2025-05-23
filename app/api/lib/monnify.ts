import axios from "axios";

const MONNIFY_BASE_URL = process.env.MONNIFY_BASE_URL!;
const API_KEY = process.env.MONNIFY_API_KEY!;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY!;

export async function getMonnifyToken() {
  const response = await axios.post(`${MONNIFY_BASE_URL}/api/v1/auth/login`, null, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString("base64")}`,
    },
  });

  return response.data.responseBody.accessToken;
}

export async function createVirtualAccount(reference: string, customerName: string, customerEmail: string) {
    try {
      const token = await getMonnifyToken();
  
      const response = await axios.post(`${MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`, {
        accountReference: reference,
        accountName: customerName,
        currencyCode: "NGN",
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        customerEmail,
        getAllAvailableBanks: true,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log(response.data);
      console.log("Monnify response:", response.data);
      return response.data.responseBody;
    } catch (error: any) {
      console.error("Monnify Error:", error.response?.data || error.message);
      throw new Error("Failed to create virtual account");
    }
  }
  
  