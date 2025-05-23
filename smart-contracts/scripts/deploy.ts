import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance));

  const AimXTokenSender = await ethers.getContractFactory("AimXTokenSender");
  const aimXTokenSender = await AimXTokenSender.deploy();
  await aimXTokenSender.waitForDeployment();

  const contractAddress = await aimXTokenSender.getAddress();
  console.log("Deployed AimXTokenSender contract at:", contractAddress);

  // Optional: save address to a file
  const data = {
    contractAddress,
    network: "anvil" // or 'sepolia' if that's what you're deploying to later
  };
  fs.writeFileSync("deployed-address.json", JSON.stringify(data, null, 2));

  console.log("Deployment address saved to deployed-address.json ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
