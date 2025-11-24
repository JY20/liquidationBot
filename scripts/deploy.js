import hre from "hardhat";

async function main() {
    // Aave V3 Pool Address (using Sepolia's as reference)
    const AAVE_POOL_ADDRESS = process.env.AAVE_POOL_ADDRESS || "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";
    
    console.log("Deploying Liquidator contract...");
    console.log("Using Aave Pool Address:", AAVE_POOL_ADDRESS);
    
    const LiquidatorFactory = await hre.ethers.getContractFactory("Liquidator");
    const liquidator = await LiquidatorFactory.deploy(AAVE_POOL_ADDRESS);
    await liquidator.deployed();
    console.log("Liquidator deployed at:", liquidator.address);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});