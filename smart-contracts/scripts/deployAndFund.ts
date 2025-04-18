import { ethers, network } from "hardhat";
import { saveDeployedAddresses, getDeployer } from "./utils";

async function main() {
  const deployer = await getDeployer();
  console.log("Deploying with:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(ethers.parseUnits("1000000", 18));
  await token.waitForDeployment();
  console.log("Token deployed at:", await token.getAddress());

  const AimXTokenSender = await ethers.getContractFactory("AimXTokenSender");
  const senderContract = await AimXTokenSender.deploy();
  await senderContract.waitForDeployment();
  console.log("Sender contract deployed at:", await senderContract.getAddress());

  const transferTx = await token.transfer(await senderContract.getAddress(), ethers.parseUnits("1000", 18));
  await transferTx.wait();
  console.log("1000 tokens transferred to sender contract");

  saveDeployedAddresses({
    tokenAddress: await token.getAddress(),
    senderAddress: await senderContract.getAddress(),
    network: network.name,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
