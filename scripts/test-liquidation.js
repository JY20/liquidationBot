import hre from "hardhat";
import dotenv from "dotenv";

dotenv.config();

const LIQUIDATOR_ADDRESS = "0x2af66A4CdFA57661F323f7145C47616e249FDba6";

// Example token addresses (you'll need to replace these with actual addresses on your network)
const WETH_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual WETH
const USDC_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual USDC

async function main() {
    console.log("=".repeat(60));
    console.log("Testing Liquidation Function");
    console.log("=".repeat(60));

    const [signer] = await hre.ethers.getSigners();
    const signerAddress = await signer.getAddress();

    // Connect to the deployed contract
    const Liquidator = await hre.ethers.getContractFactory("Liquidator");
    const liquidator = Liquidator.attach(LIQUIDATOR_ADDRESS);

    // Connect to ERC20 token interface
    const ERC20_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
    ];

    console.log("\n📍 Your Address:", signerAddress);
    console.log("📄 Liquidator Contract:", LIQUIDATOR_ADDRESS);

    console.log("\n" + "=".repeat(60));
    console.log("Pre-Liquidation Checks");
    console.log("=".repeat(60));

    // Example liquidation parameters (you'll need actual values)
    const borrowerAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual borrower
    const collateralAsset = WETH_ADDRESS; // Asset being used as collateral
    const debtAsset = USDC_ADDRESS; // Asset being borrowed
    const debtToCover = hre.ethers.utils.parseUnits("100", 6); // 100 USDC (6 decimals)

    try {
        // Check if we have the debt token
        const debtToken = new hre.ethers.Contract(debtAsset, ERC20_ABI, signer);
        const debtBalance = await debtToken.balanceOf(signerAddress);
        console.log(`Debt Token Balance (${debtAsset}):`, hre.ethers.utils.formatUnits(debtBalance, 6));

        if (debtBalance.lt(debtToCover)) {
            console.log("⚠️  Insufficient debt token balance for liquidation");
            console.log("   You need at least:", hre.ethers.utils.formatUnits(debtToCover, 6));
            return;
        }

        // Check allowance
        const allowance = await debtToken.allowance(signerAddress, LIQUIDATOR_ADDRESS);
        console.log("Current Allowance:", hre.ethers.utils.formatUnits(allowance, 6));

        if (allowance.lt(debtToCover)) {
            console.log("\nApproving liquidator to spend debt tokens...");
            const approveTx = await debtToken.approve(LIQUIDATOR_ADDRESS, debtToCover);
            await approveTx.wait();
            console.log("✅ Approval successful!");
        }

        console.log("\n" + "=".repeat(60));
        console.log("Executing Liquidation");
        console.log("=".repeat(60));

        console.log("Parameters:");
        console.log("  Borrower:", borrowerAddress);
        console.log("  Collateral Asset:", collateralAsset);
        console.log("  Debt Asset:", debtAsset);
        console.log("  Debt to Cover:", hre.ethers.utils.formatUnits(debtToCover, 6));

        const tx = await liquidator.liquidate(
            borrowerAddress,
            collateralAsset,
            debtAsset,
            debtToCover
        );

        console.log("Transaction hash:", tx.hash);
        console.log("Waiting for confirmation...");

        const receipt = await tx.wait();
        console.log("✅ Liquidation successful!");
        console.log("Gas used:", receipt.gasUsed.toString());

        // Check for events
        console.log("\n" + "=".repeat(60));
        console.log("Events Emitted");
        console.log("=".repeat(60));

        const liquidationEvents = receipt.events?.filter(
            (e) => e.event === "LiquidationExecuted"
        );

        if (liquidationEvents && liquidationEvents.length > 0) {
            liquidationEvents.forEach((event, index) => {
                console.log(`Event ${index + 1}:`);
                console.log("  Borrower:", event.args.borrower);
                console.log("  Collateral Asset:", event.args.collateralAsset);
                console.log("  Debt Asset:", event.args.debtAsset);
                console.log("  Debt Covered:", hre.ethers.utils.formatUnits(event.args.debtCovered, 6));
                console.log("  Collateral Received:", event.args.collateralReceived.toString());
            });
        }

    } catch (error) {
        console.error("\n❌ Error during liquidation:");
        console.error("Message:", error.message);
        if (error.data) {
            console.error("Data:", error.data);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("Test Complete!");
    console.log("=".repeat(60));
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

