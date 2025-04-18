// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AimXTokenSender is Ownable {

    constructor() Ownable(msg.sender) {}

    // Send any ERC-20 token from this contract to a recipient
    function sendToken(address tokenAddress, address recipient, uint256 amount) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than zero");

        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance in contract");

        bool sent = token.transfer(recipient, amount);
        require(sent, "Token transfer failed");
    }

    // Allow contract to receive ETH
    receive() external payable {}

    // Withdraw ETH from contract
    function withdrawETH(address payable recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(address(this).balance >= amount, "Insufficient ETH in contract");

        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "ETH transfer failed");
    }
}
