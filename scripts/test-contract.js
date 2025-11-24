import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const LIQUIDATOR_ADDRESS = "0x2af66A4CdFA57661F323f7145C47616e249FDba6";

async function main() {
    console.log("=".repeat(60));
    console.log("Testing Liquidator Contract");
    console.log("=".repeat(60));

    const [signer] = await hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    console.log("\n📍 Your Address:", signerAddress);
    console.log("📄 Contract Address:", LIQUIDATOR_ADDRESS);

    // Connect to the deployed contract
    const Liquidator = await hre.ethers.getContractFactory("Liquidator");
    const liquidator = Liquidator.attach(LIQUIDATOR_ADDRESS);

    console.log("\n" + "=".repeat(60));
    console.log("1. Reading Contract State");
    console.log("=".repeat(60));

    try {
        const owner = await liquidator.owner();
        console.log("Owner:", owner);
        console.log("Is owner you?", owner.toLowerCase() === signerAddress.toLowerCase());

        const aavePool = await liquidator.aavePool();
        console.log("Aave Pool:", aavePool);

        const value = await liquidator.value();
        console.log("Current Value:", value.toString());
    } catch (error) {
        console.error("Error reading state:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("2. Testing Increment Function");
    console.log("=".repeat(60));

    try {
        const valueBefore = await liquidator.value();
        console.log("Value before:", valueBefore.toString());

        console.log("Sending increment transaction...");
        const tx = await liquidator.increment();
        console.log("Transaction hash:", tx.hash);
        
        console.log("Waiting for confirmation...");
        await tx.wait();
        console.log("Transaction confirmed!");

        const valueAfter = await liquidator.value();
        console.log("Value after:", valueAfter.toString());
        console.log("Increment successful:", valueAfter.toNumber() === valueBefore.toNumber() + 1);
    } catch (error) {
        console.error("Error incrementing:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("3. Testing Owner-Only Functions");
    console.log("=".repeat(60));

    try {
        const owner = await liquidator.owner();
        if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
            console.log("You are not the owner. Skipping owner-only tests.");
        } else {
            console.log("You are the owner. Owner-only functions available.");
            
            // Test withdraw function (will fail if no tokens in contract)
            console.log("\nTesting withdraw function...");
            console.log("Note: This will only succeed if the contract has tokens.");
            
            // You would uncomment and modify this with actual token address
            // const tokenAddress = "0x...";
            // const amount = hre.ethers.utils.parseEther("0.01");
            // const tx = await liquidator.withdraw(tokenAddress, signerAddress, amount);
            // await tx.wait();
            // console.log("✅ Withdraw successful!");
        }
    } catch (error) {
        console.error("Error testing owner functions:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("4. Contract Balance Check");
    console.log("=".repeat(60));

    try {
        const balance = await hre.ethers.provider.getBalance(LIQUIDATOR_ADDRESS);
        console.log("Contract Balance:", hre.ethers.utils.formatEther(balance), "ETH");
    } catch (error) {
        console.error("Error checking balance:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("Testing Complete!");
    console.log("=".repeat(60));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

