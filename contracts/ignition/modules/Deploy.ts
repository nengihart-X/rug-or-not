import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RugNotModule = buildModule("RugNotModule", (m) => {
    // Existing $RUGNOT Token Address
    const rugNotTokenAddress = "0xa1832f7F4e534aE557f9B5AB76dE54B1873e498B";

    // Deploy the Staking Contract, passing the EXISTING Token address
    const rugNotStaking = m.contract("RugNotStaking", [rugNotTokenAddress]);

    return { rugNotStaking };
});

export default RugNotModule;
