import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [signer] = await hre.ethers.getSigners();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    
    console.log("Wallet Address:", address);
    console.log("Balance:", hre.ethers.utils.formatEther(balance), "XRP");
    console.log("\nTo deploy, you need some tokens for gas fees");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

