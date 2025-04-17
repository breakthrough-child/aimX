import { ethers } from "ethers";
import contractABI from "./contractABI.json"; // if your ABI is here

export async function sendCoinToRecipient(recipient: string, amount: string) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS as string,
    contractABI,
    signer
  );

  const tx = await contract.sendCoin(recipient, ethers.parseUnits(amount, 18));
  await tx.wait();
  return tx.hash;
}
