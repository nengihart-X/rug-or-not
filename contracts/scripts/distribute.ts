const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Distributing tokens with account:", deployer.address);

    // REPLACE THESE WITH REAL ADDRESSES AFTER DEPLOYMENT
    const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
    const STAKING_ADDRESS = process.env.STAKING_ADDRESS;
    const MULTISIG_WALLET = "0x1234567890123456789012345678901234567890"; // Reserve Wallet

    if (!TOKEN_ADDRESS || !STAKING_ADDRESS) {
        console.error("Please set TOKEN_ADDRESS and STAKING_ADDRESS env vars");
        return;
    }

    const token = await hre.ethers.getContractAt("RugNotToken", TOKEN_ADDRESS);

    // Distribution Plan
    // 70% (700k) -> Liquidity (Keep in deployer to add to Uniswap later, or send to LP setup address)
    // 20% (200k) -> Rewards Pool (Send to Staking Contract)
    // 10% (100k) -> Builder Reserve (Send to Multisig)

    const decimals = await token.decimals();
    const amountRewards = hre.ethers.parseUnits("200000", decimals);
    const amountReserve = hre.ethers.parseUnits("100000", decimals);

    console.log(`Sending 200,000 RUGNOT to Staking Contract (${STAKING_ADDRESS})...`);
    const tx1 = await token.transfer(STAKING_ADDRESS, amountRewards);
    await tx1.wait();
    console.log("Transferred!");

    console.log(`Sending 100,000 RUGNOT to Builder Reserve (${MULTISIG_WALLET})...`);
    const tx2 = await token.transfer(MULTISIG_WALLET, amountReserve);
    await tx2.wait();
    console.log("Transferred!");

    console.log("Remaining 700,000 RUGNOT stayed with deployer for Liquidity Provisioning.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
