// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract SwapContract {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function swap(
        address fromToken,
        address toToken,
        uint256 totalAmount,  // amount you collect
        uint256 toAmount,     // amount you send back to user
        address userAddress
    ) external {
        require(msg.sender == userAddress, "Unauthorized call");

        // Transfer totalAmount of fromToken from user to owner (your wallet)
        IERC20(fromToken).transferFrom(userAddress, owner, totalAmount);

        // Send toAmount of toToken from contract to user
        IERC20(toToken).transfer(userAddress, toAmount);
    }

    // Allow owner to deposit tokens for swap liquidity
    function depositTokens(address token, uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }
}
