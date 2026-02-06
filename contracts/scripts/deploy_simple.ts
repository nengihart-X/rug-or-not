const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Existing $RUGNOT Token Address
    const rugNotTokenAddress = "0xa1832f7F4e534aE557f9B5AB76dE54B1873e498B";
    console.log("Using existing token:", rugNotTokenAddress);

    const RugNotStaking = await hre.ethers.getContractFactory("RugNotStaking");
    const rugNotStaking = await RugNotStaking.deploy(rugNotTokenAddress);

    console.log("Deploying RugNotStaking...");
    await rugNotStaking.waitForDeployment();

    console.log("RugNotStaking deployed to:", await rugNotStaking.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
