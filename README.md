# Aave Liquidation Bot

Automated liquidation bot for the Aave V3 lending protocol. This bot monitors Aave positions and executes profitable liquidations on undercollateralized loans.

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- An wallet with private key
- Token for gas fees
- RPC endpoint

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
XRPL_EVM_RPC=https://rpc.testnet.xrplevm.org/
```

## Smart Contract

### Liquidator Contract

The `Liquidator.sol` contract is the core smart contract that executes liquidations on the Aave protocol.

**Location:** `contract/liquidator.sol`

**Key Features:**
- Owner-only access control for withdrawals
- Integration with Aave V3 Pool interface
- ERC20 token handling via OpenZeppelin contracts
- Emergency withdrawal function for rescued funds


**Dependencies:**
- `@aave/core-v3` - Aave V3 protocol interfaces
- `@openzeppelin/contracts` - Standard ERC20 interface

### Compiling the Contract

Compile the smart contract using Hardhat:

```bash
npx hardhat compile
```

This will generate the contract artifacts in the `artifacts/` directory.

### Deploying the Contract

#### 1. Configure Your Network

Edit `hardhat.config.js` to add your target network:


#### 2. Deploy Using Script

Deploy to your configured network:

```bash
# Deploy to XRPL EVM
npx hardhat run scripts/deploy.js --network xrplEVM
```

#### 3. Save Deployed Address

After deployment, save the contract address shown in the console output:

```
Liquidator deployed at: 0x...
```

Add this to your `.env` file:

```env
LIQUIDATOR_CONTRACT_ADDRESS=0x...
```

### Testing the Contract

Run the test suite:

```bash
npm test
```

Or using Hardhat directly:

```bash
npx hardhat test
```

For more verbose output:

```bash
npx hardhat test --verbose
```

### Verifying the Contract

1. Run the verification command:

```bash
npx hardhat verify --network mainnet <DEPLOYED_CONTRACT_ADDRESS>
```

## Available Scripts

### Bot Operations

**Start the liquidation bot:**
```bash
npm start
```

**Start with auto-restart (development):**
```bash
npm run dev
```

## Aave V3 Pool Addresses

## Project Structure

```
liquidationBot/
├── bot/                    # Bot logic
│   ├── index.js           # Main bot entry point
├── contract/              # Smart contracts
│   └── liquidator.sol     # Main liquidator contract
├── scripts/               # Utility scripts
│   ├── deploy.js          # Deployment script
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Dependencies
└── .env                   # Environment variables (create this)
```

## Security Considerations

1. **Never commit your `.env` file** - It's already in `.gitignore`
2. **Use a dedicated wallet** - Don't use your main wallet for the bot
3. **Start with testnet** - Test thoroughly on Sepolia before mainnet
4. **Monitor gas costs** - Set appropriate gas limits and prices
5. **Keep private keys secure** - Use environment variables, never hardcode

## Troubleshooting

### Contract Compilation Errors

If you see import errors, ensure dependencies are installed:

```bash
npm install @aave/core-v3 @openzeppelin/contracts
```

### Deployment Failures

- Check your wallet has sufficient ETH for deployment
- Verify RPC_URL is correct and accessible
- Ensure PRIVATE_KEY is properly formatted (with or without 0x prefix)

### Bot Not Finding Liquidations

- Verify AAVE_POOL_ADDRESS matches your network
- Check liquidation thresholds in configuration
- Ensure RPC endpoint is stable and not rate-limited

## License

MIT

## Disclaimer

This software is provided as-is. Liquidation bots involve financial risk. Always test thoroughly on testnets before using real funds. The authors are not responsible for any losses incurred.

