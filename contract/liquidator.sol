// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Liquidator {
    address public owner;
    IPool public immutable aavePool;
    uint256 public value;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function increment() external {
        value++;
    }

    function withdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}