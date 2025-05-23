import { ethers } from "hardhat";
import { loadDeployedAddresses, getDeployer } from "./utils";
import { getERC20Balance } from "./utils";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const sender = await getDeployer();
  console.log("Using signer:", sender.address);

  const { tokenAddress, senderAddress } = loadDeployedAddresses();

  console.log("Using token at:", tokenAddress);
  console.log("Using sender contract at:", senderAddress);

  const tokenSender = await ethers.getContractAt("AimXTokenSender", senderAddress);
  const token = await ethers.getContractAt("MyToken", tokenAddress);

  const senderContractBalance = await token.balanceOf(senderAddress);
  console.log("Sender contract token balance:", ethers.formatUnits(senderContractBalance, 18));

  const amount = ethers.parseUnits("10", 18);
  const recipient = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
  console.log(`Sending ${ethers.formatUnits(amount, 18)} tokens to ${recipient}...`);

  const tx = await tokenSender.sendToken(tokenAddress, recipient, amount);
  console.log("Transaction sent, hash:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed ✅");

  const recipientBalance = await token.balanceOf(recipient);
  console.log("Recipient token balance:", ethers.formatUnits(recipientBalance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



async function checkBalance() {
  const { tokenAddress } = loadDeployedAddresses();
  const addressToCheck = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  const balance = await getERC20Balance(tokenAddress, addressToCheck);
  console.log(
    `Balance for ${addressToCheck}: ${ethers.formatUnits(balance, 18)} tokens`
  );
}

checkBalance().catch(console.error);


