// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract TokenSwap {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function swapTokens(
        address tokenFrom,
        address tokenTo,
        uint256 amountFrom,
        uint256 amountTo
    ) external {
        require(amountFrom > 0 && amountTo > 0, "Invalid amounts");

        // Transfer tokenFrom from the user to the owner
        require(IERC20(tokenFrom).transferFrom(msg.sender, owner, amountFrom), "TokenFrom transfer failed");

        // Transfer tokenTo from the owner to the user
        require(IERC20(tokenTo).transferFrom(owner, msg.sender, amountTo), "TokenTo transfer failed");
    }
}