import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [signer] = await ethers.getSigners();

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed token
  const senderContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // AimXTokenSender address

  const Token = await ethers.getContractAt("MyToken", tokenAddress);

  console.log(`Sending tokens to contract...`);
  const tx = await Token.transfer(senderContractAddress, ethers.parseUnits("100", 18));
  await tx.wait();
  console.log(`Contract funded ✅`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
