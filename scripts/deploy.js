import hre from "hardhat";

async function main() {
    const LiquidatorFactory = await hre.ethers.getContractFactory("Liquidator");
    const liquidator = await LiquidatorFactory.deploy();
    await liquidator.deployed();
    console.log("Liquidator deployed at:", liquidator.address);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});