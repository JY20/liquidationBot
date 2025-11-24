import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";

dotenv.config();

export default {
  solidity: "0.8.24",
  paths: {
    sources: "./contract"
  },
  networks: {
    xrplEVM: {
      url: process.env.XRPL_EVM_RPC,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
