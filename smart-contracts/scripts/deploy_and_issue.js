const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const EduAuthenticate = await hre.ethers.getContractFactory("EduAuthenticate");
    const eduAuth = await EduAuthenticate.deploy();
    await eduAuth.waitForDeployment();
    const address = await eduAuth.getAddress();

    // IMMEDIATELY write address to disk
    fs.writeFileSync("deployed_address.txt", address);
    console.log("EduAuthenticate deployed to:", address);

    // Issue a test certificate
    console.log("Issuing test certificate 'EDU-TEST-001'...");
    const docHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("Test Document Content"));
    const tx = await eduAuth.issueCertificate(
        "EDU-TEST-001",
        docHash,
        deployer.address,
        "ipfs://test-metadata"
    );
    await tx.wait();
    console.log("Certificate Issued!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
