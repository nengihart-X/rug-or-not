const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy Token
    console.log("Deploying RugNotToken...");
    const RugNotToken = await hre.ethers.getContractFactory("RugNotToken");
    const token = await RugNotToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("RugNotToken deployed to:", tokenAddress);

    // 2. Deploy Staking
    console.log("Deploying RugNotStaking...");
    const RugNotStaking = await hre.ethers.getContractFactory("RugNotStaking");
    const staking = await RugNotStaking.deploy(tokenAddress);
    await staking.waitForDeployment();
    console.log("RugNotStaking deployed to:", await staking.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
