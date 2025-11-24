import { config } from "./config.js";

export class PositionScanner {
    constructor(contractManager) {
        this.contractManager = contractManager;
    }
    
    async findLiquidatablePositions() {
        console.log(`\nChecking ${config.monitoredUsers.length} user(s)...`);
        
        const liquidatable = [];
        
        for (const user of config.monitoredUsers) {
            try {
                const data = await this.contractManager.getUserAccountData(user);
                console.log(`${user}: HF=${data.healthFactor.toFixed(4)}, Debt=$${data.totalDebt.toFixed(2)}`);
                
                if (data.healthFactor < 1.0 && data.totalDebt > 0) {
                    console.log(`LIQUIDATABLE!`);
                    liquidatable.push({ user, ...data });
                }
            } catch (error) {
                console.log(`${user}: Error - ${error.message}`);
            }
        }
        
        return liquidatable;
    }
}
