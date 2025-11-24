import { ethers } from "ethers";

async function main() {
    // Generate a new random wallet
    const wallet = ethers.Wallet.createRandom();
    
    console.log("=".repeat(60));
    console.log("NEW TESTNET WALLET GENERATED");
    console.log("=".repeat(60));
    console.log("\nAddress:", wallet.address);
    console.log("\nPrivate Key:", wallet.privateKey);
    console.log("\nIMPORTANT: Save this private key securely!");
    console.log("Never share your private key with anyone!");
    console.log("This is for TESTNET only - DO NOT send real funds!");
    console.log("\n" + "=".repeat(60));
    console.log("\nUpdate your .env file with:");
    console.log(`PRIVATE_KEY=${wallet.privateKey.slice(2)}`);
    console.log("\nThen get testnet XRP from a faucet for this address:");
    console.log(wallet.address);
    console.log("=".repeat(60));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

