# Aave Liquidation Bot

Automated liquidation bot for Aave V3 lending protocol. Monitors specific user positions and executes liquidations when they become undercollateralized.

## Features

- 🔍 Monitors health factors of specified user addresses
- ⚡ Automatically executes liquidations when HF < 1.0
- 🧪 Dry-run mode for safe testing
- 📊 Real-time position monitoring
- 🔒 Owner-only liquidation contract with profit withdrawal

## Prerequisites

- Node.js >= 18.0.0
- Wallet with private key
- Tokens for gas fees
- RPC endpoint (XRPL EVM or Ethereum)

## Installation

1. Clone and install dependencies:

```bash
git clone <repository-url>
cd liquidationBot
npm install
```

2. Create `.env` file:

```env
# Network
XRPL_EVM_RPC=https://rpc.testnet.xrplevm.org/

# Wallet
PRIVATE_KEY=your_private_key_here

# Contracts
LIQUIDATOR_CONTRACT_ADDRESS=0x2af66A4CdFA57661F323f7145C47616e249FDba6
AAVE_POOL_ADDRESS=0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951

# Monitored Users (comma-separated)
MONITORED_USERS=0x1234...,0x5678...

# Bot Settings
MIN_PROFIT_USD=5
SCAN_INTERVAL=5000
DRY_RUN=true
```

## Smart Contract

### Deploy Contract

1. Compile:
```bash
npx hardhat compile
```

2. Deploy to XRPL EVM:
```bash
npx hardhat run scripts/deploy.js --network xrplEVM
```

3. Save the deployed address to `.env`:
```env
LIQUIDATOR_CONTRACT_ADDRESS=0x...
```

### Test Contract

```bash
npx hardhat run scripts/test-contract.js --network xrplEVM
```

### Contract Features

- Owner-only access control
- Integration with Aave V3 Pool
- Emergency token withdrawal
- Liquidation event logging

## Running the Bot

### Start in Test Mode (Recommended)

```bash
npm start
```

The bot will:
- Check monitored users every 5 seconds
- Display health factors and debt amounts
- Simulate liquidations without executing transactions

### Start in Live Mode

1. Set `DRY_RUN=false` in `.env`
2. Ensure you have sufficient gas fees
3. Run:

```bash
npm start
```

**Warning:** Live mode executes real transactions and spends gas!

### Stop the Bot

Press `Ctrl + C`

## Utility Scripts

### Create New Wallet

```bash
node scripts/create-wallet.js
```

### Check Wallet Balance

```bash
npx hardhat run scripts/check-balance.js --network xrplEVM
```

## How It Works

1. **Scanning:** Bot queries Aave for health factors of monitored users
2. **Detection:** Identifies positions with HF < 1.0 and debt > 0
3. **Execution:** Calls liquidator contract to execute liquidation
4. **Profit:** Contract receives collateral bonus and transfers to owner

## Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `XRPL_EVM_RPC` | RPC endpoint URL | Required |
| `PRIVATE_KEY` | Wallet private key | Required |
| `LIQUIDATOR_CONTRACT_ADDRESS` | Deployed contract address | Required |
| `AAVE_POOL_ADDRESS` | Aave V3 Pool address | Required |
| `MONITORED_USERS` | Addresses to monitor (comma-separated) | Required |
| `MIN_PROFIT_USD` | Minimum profit threshold | 5 |
| `SCAN_INTERVAL` | Time between scans (ms) | 5000 |
| `DRY_RUN` | Enable test mode | true |

## Project Structure

```
liquidationBot/
├── bot/
│   ├── index.js          # Main bot logic
│   ├── config.js         # Configuration
│   ├── contracts.js      # Contract interactions
│   └── scanner.js        # Position scanner
├── contract/
│   └── liquidator.sol    # Liquidation smart contract
├── scripts/
│   ├── deploy.js         # Deploy contract
│   ├── test-contract.js  # Test deployed contract
│   ├── create-wallet.js  # Generate wallet
│   └── check-balance.js  # Check balance
├── hardhat.config.js     # Hardhat config
├── package.json          # Dependencies
└── .env                  # Configuration (create this)
```

## Smart Contract (Solidity)

The liquidator contract (`contract/liquidator.sol`):
- Receives debt tokens from bot
- Executes liquidation on Aave
- Receives collateral with 5% bonus
- Transfers profit to owner

## Bot Architecture

1. **Config** - Loads environment variables
2. **ContractManager** - Handles blockchain interactions
3. **PositionScanner** - Monitors user health factors
4. **Bot** - Orchestrates scanning and liquidation

## Safety Features

- ✅ Dry-run mode for testing
- ✅ Health factor validation (HF < 1.0)
- ✅ Owner-only contract access
- ✅ Minimum profit threshold
- ✅ Configurable scan interval

## Aave V3 Pool Addresses

| Network | Pool Address |
|---------|-------------|
| Ethereum Mainnet | `0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2` |
| Sepolia Testnet | `0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951` |
| Polygon | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` |
| Arbitrum | `0x794a61358D6845594F94dc1DB02A252b5b4814aD` |

## Troubleshooting

**Bot won't start:**
- Verify all required env variables are set
- Check MONITORED_USERS is not empty

**No liquidatable positions:**
- Ensure monitored addresses have active Aave positions
- Check addresses are correct

**Transaction fails:**
- Verify sufficient gas in wallet
- Check debt token balance
- Ensure contract is deployed correctly

## Security Considerations

1. **Never commit `.env`** - It's gitignored by default
2. **Use dedicated wallet** - Don't use your main wallet
3. **Test on testnet first** - Always use DRY_RUN=true initially
4. **Monitor gas costs** - Track profitability
5. **Keep private key secure** - Use environment variables only

## License

MIT

## Disclaimer

This software is provided as-is. Liquidation bots involve financial risk. Always test thoroughly on testnets before deploying with real funds. The authors are not responsible for any losses incurred.
