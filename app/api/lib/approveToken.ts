import { ethers } from 'ethers';
import erc20ABI from '@/smart-contracts/ERC20.json';

export const approveToken = async (
  signer: ethers.Signer,
  tokenAddress: string,
  spenderAddress: string,
  amount: string // in wei
) => {
  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await tokenContract.approve(spenderAddress, amount);
  await tx.wait();
  return tx.hash;
};
