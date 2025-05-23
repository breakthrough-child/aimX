import { ethers, network } from "hardhat";
import fs from "fs";

export function loadDeployedAddresses() {
  const fileName = `deployed-${network.name}.json`;
  if (!fs.existsSync(fileName)) {
    throw new Error(`Deployment file for network '${network.name}' not found: ${fileName}`);
  }
  const addresses = JSON.parse(fs.readFileSync(fileName, "utf-8"));
  return addresses;
}

export function saveDeployedAddresses(addresses: any) {
  const fileName = `deployed-${network.name}.json`;
  fs.writeFileSync(fileName, JSON.stringify(addresses, null, 2));
  console.log(`Deployed addresses saved to ${fileName}`);
}

export async function getDeployer() {
  const [deployer] = await ethers.getSigners();
  return deployer;
}

export async function getERC20Balance(tokenAddress: string, account: string) {
    const token = await ethers.getContractAt("IERC20", tokenAddress);
    const balance = await token.balanceOf(account);
    return balance;
  }
