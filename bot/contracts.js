import { ethers } from "ethers";
import { config } from "./config.js";

const LIQUIDATOR_ABI = [
    "function liquidate(address borrower, address collateralAsset, address debtAsset, uint256 debtToCover)",
    "event LiquidationExecuted(address indexed borrower, address indexed collateralAsset, address indexed debtAsset, uint256 debtCovered, uint256 collateralReceived)"
];

const AAVE_POOL_ABI = [
    "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)"
];

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)"
];

export class ContractManager {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        this.liquidator = new ethers.Contract(config.liquidatorAddress, LIQUIDATOR_ABI, this.wallet);
        this.aavePool = new ethers.Contract(config.aavePoolAddress, AAVE_POOL_ABI, this.provider);
        
        console.log("Contracts initialized");
        console.log("Wallet:", this.wallet.address);
    }
    
    async getUserAccountData(userAddress) {
        const data = await this.aavePool.getUserAccountData(userAddress);
        return {
            healthFactor: parseFloat(ethers.utils.formatUnits(data.healthFactor, 18)),
            totalDebt: parseFloat(ethers.utils.formatUnits(data.totalDebtBase, 8))
        };
    }
    
    async executeLiquidation(borrower, collateralAsset, debtAsset, debtAmount) {
        if (config.dryRun) {
            console.log("DRY RUN - Skipping actual transaction");
            return { success: true, hash: "DRY_RUN" };
        }
        
        // Approve token
        const token = new ethers.Contract(debtAsset, ERC20_ABI, this.wallet);
        const tx1 = await token.approve(config.liquidatorAddress, ethers.constants.MaxUint256);
        await tx1.wait();
        
        // Execute liquidation
        const tx = await this.liquidator.liquidate(borrower, collateralAsset, debtAsset, debtAmount);
        console.log("Transaction:", tx.hash);
        const receipt = await tx.wait();
        console.log("Confirmed!");
        
        return { success: true, hash: tx.hash };
    }
}

