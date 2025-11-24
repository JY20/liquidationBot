import { config } from "./config.js";
import { ContractManager } from "./contracts.js";
import { PositionScanner } from "./scanner.js";

class LiquidationBot {
    async start() {
        console.log("\n" + "=".repeat(60));
        console.log("AAVE LIQUIDATION BOT");
        console.log("=".repeat(60));
        console.log(`Network: ${config.rpcUrl}`);
        console.log(`Liquidator: ${config.liquidatorAddress}`);
        console.log(`Monitored Users: ${config.monitoredUsers.length}`);
        config.monitoredUsers.forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
        console.log(`Scan Interval: ${config.scanInterval / 1000}s`);
        console.log(`Dry Run: ${config.dryRun ? "YES ⚠️" : "NO"}`);
        console.log("=".repeat(60) + "\n");
        
        this.contractManager = new ContractManager();
        this.scanner = new PositionScanner(this.contractManager);
        this.scanCount = 0;
        
        // Run scan loop
        while (true) {
            this.scanCount++;
            console.log(`\n[Scan #${this.scanCount}] ${new Date().toLocaleTimeString()}`);
            
            const positions = await this.scanner.findLiquidatablePositions();
            
            if (positions.length === 0) {
                console.log("No liquidatable positions");
            } else {
                for (const pos of positions) {
                    await this.liquidate(pos);
                }
            }
            
            console.log(`\nNext scan in ${config.scanInterval / 1000}s...`);
            await this.sleep(config.scanInterval);
        }
    }
    
    async liquidate(position) {
        console.log(`\nLiquidating ${position.user}...`);
        
        // Simple example: Liquidate with placeholder assets
        // You'll need to determine actual collateral/debt assets
        const debtAsset = "0x0000000000000000000000000000000000000000"; // Replace with actual
        const collateralAsset = "0x0000000000000000000000000000000000000000"; // Replace with actual
        const debtAmount = "1000000000000000000"; // 1 token
        
        const result = await this.contractManager.executeLiquidation(
            position.user,
            collateralAsset,
            debtAsset,
            debtAmount
        );
        
        if (result.success) {
            console.log(`Success! TX: ${result.hash}`);
        } else {
            console.log(`Failed`);
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const bot = new LiquidationBot();
bot.start().catch(console.error);
