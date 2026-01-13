const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy
    const EduAuthenticate = await hre.ethers.getContractFactory("EduAuthenticate");
    const eduAuth = await EduAuthenticate.deploy();

    await eduAuth.waitForDeployment();
    const address = await eduAuth.getAddress();

    console.log("EduAuthenticate deployed to:", address);
    console.log("-----------------------------------------");
    console.log("Action Required:");
    console.log(`1. Copy address '${address}' to frontend/src/contracts/address.js`);
    console.log("2. Copy artifacts/contracts/EduAuthenticate.sol/EduAuthenticate.json content to frontend/src/contracts/EduAuthenticate.json (if ABI changed)");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
