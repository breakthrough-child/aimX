import { ethers } from "ethers";
import CONTRACT_ABI from "./contractAbi.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

export async function releaseCrypto(toAddress: string, amount: number, coinType: string) {
  try {
    const tx = await contract.releaseTokens(toAddress, ethers.parseEther(amount.toString()), coinType);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  } catch (err) {
    console.error("Smart contract release failed:", err);
    return { success: false, error: err };
  }
}
