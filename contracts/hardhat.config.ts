import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const formattedKey = PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : "0x" + PRIVATE_KEY;

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
            accounts: PRIVATE_KEY ? [formattedKey] : [],
            chainId: 84532,
        },
        baseMainnet: {
            url: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
            accounts: PRIVATE_KEY ? [formattedKey] : [],
            chainId: 8453,
        },
    },
};

export default config;
