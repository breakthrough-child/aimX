import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying token with account:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(ethers.parseUnits("1000000", 18)); // 1 million tokens
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  fs.writeFileSync(
    "token-address.json",
    JSON.stringify({ tokenAddress, network: "anvil" }, null, 2)
  );

  console.log("Token address saved to token-address.json ✅");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
