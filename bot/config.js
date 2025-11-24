import dotenv from "dotenv";
dotenv.config();

export const config = {
    rpcUrl: process.env.XRPL_EVM_RPC,
    privateKey: process.env.PRIVATE_KEY,
    liquidatorAddress: process.env.LIQUIDATOR_CONTRACT_ADDRESS,
    aavePoolAddress: process.env.AAVE_POOL_ADDRESS,
    monitoredUsers: process.env.MONITORED_USERS ? process.env.MONITORED_USERS.split(",").map(addr => addr.trim()) : [],
    minProfitUSD: parseFloat(process.env.MIN_PROFIT_USD || "5"),
    scanInterval: parseInt(process.env.SCAN_INTERVAL || "5000"),
    dryRun: process.env.DRY_RUN === "true",
};

