// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Liquidator {
    address public owner;
    IPool public immutable aavePool;
    uint256 public value;

    event LiquidationExecuted(
        address indexed borrower,
        address indexed collateralAsset,
        address indexed debtAsset,
        uint256 debtCovered,
        uint256 collateralReceived
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _pool) {
        aavePool = IPool(_pool);
        owner = msg.sender;
    }

    function increment() external {
        value++;
    }

    function liquidate(address borrower, address collateralAsset, address debtAsset, uint256 debtToCover) external onlyOwner {
        IERC20(debtAsset).transferFrom(msg.sender, address(this), debtToCover);
        IERC20(debtAsset).approve(address(aavePool), debtToCover);

        aavePool.liquidationCall(collateralAsset, debtAsset, borrower, debtToCover, false);

        uint256 profit = IERC20(collateralAsset).balanceOf(address(this));
        require(profit > 0, "No collateral received");
        IERC20(collateralAsset).transfer(owner, profit);

        emit LiquidationExecuted(borrower, collateralAsset, debtAsset, debtToCover, profit);
    }

    function withdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}