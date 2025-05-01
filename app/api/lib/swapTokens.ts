import { ethers } from 'ethers';
import TokenSwapArtifact from '@/smart-contracts/TokenSwap.json';

const TOKEN_SWAP_CONTRACT = '0xYourDeployedContractAddressHere';

export const swapTokens = async (
  signer: ethers.Signer,
  tokenFrom: string,
  tokenTo: string,
  amountFrom: string, // in wei
  amountTo: string    // in wei
) => {
  const contract = new ethers.Contract(
    TOKEN_SWAP_CONTRACT,
    TokenSwapArtifact.abi, // now properly typed
    signer
  );

  const tx = await contract.swapTokens(tokenFrom, tokenTo, amountFrom, amountTo);
  await tx.wait();

  return tx.hash;
};
