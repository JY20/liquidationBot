import hre from "hardhat";

async function main() {
    const Counter = await hre.ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();
    await counter.deployed();
    console.log("Counter deployed at:", counter.address);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});