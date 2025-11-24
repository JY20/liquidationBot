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
AAVE_POOL_ADDRESS=0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951
```

**Note:** Using Sepolia's Aave V3 pool address as reference.

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

Deploy to XRPL EVM:

```bash
npx hardhat run scripts/deploy.js --network xrplEVM
```

The contract will be deployed using Sepolia's Aave V3 pool address (0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951) as reference.

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

### Testing Deployed Contract

After deploying your contract, you can test it with the provided test scripts:

#### Basic Contract Test

Test basic functionality (owner, increment, state):

```bash
npx hardhat run scripts/test-contract.js --network xrplEVM
```

This script will:
- Read contract state (owner, aavePool, value)
- Test the increment function
- Check contract balance
- Verify owner-only access

#### Liquidation Function Test

Test the liquidation functionality:

```bash
npx hardhat run scripts/test-liquidation.js --network xrplEVM
```

**Note:** Before running liquidation tests, you need to:
1. Update token addresses in `scripts/test-liquidation.js`
2. Have sufficient debt tokens in your wallet
3. Approve the liquidator contract to spend your tokens
4. Have a valid borrower address to liquidate

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
│   ├── test-contract.js   # Basic contract testing
│   ├── test-liquidation.js # Liquidation function testing
│   ├── create-wallet.js   # Wallet generation
│   └── check-balance.js   # Balance checker
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

