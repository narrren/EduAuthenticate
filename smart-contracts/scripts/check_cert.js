const hre = require("hardhat");
const { EDU_AUTHENTICATE_ADDRESS } = require("../frontend/src/contracts/address.js"); // We can't require ES modules easily in CJS script without config. 
// Let's just read the file or hardcode for the check script since we know the address from Step 380: 0x9fE46736679d2D9a65F0992F22722dE9f3c7fa6e0

async function main() {
    // Read address from file to be safe, or just use the one we know
    const address = "0x9fE46736679d2D9a65F0992F22722dE9f3c7fa6e0";
    console.log("Checking contract at:", address);

    const EduAuthenticate = await hre.ethers.getContractFactory("EduAuthenticate");
    const eduAuth = EduAuthenticate.attach(address);

    const certId = "EDU-TEST-001";
    console.log(`Verifying ID: ${certId}...`);

    try {
        const result = await eduAuth.verifyCertificate(certId);
        console.log("Result:", result);
        if (result.isValid) {
            console.log("✅ Certificate is VALID on chain.");
        } else {
            console.log("❌ Certificate is INVALID/NOT FOUND.");
        }
    } catch (e) {
        console.error("Error connecting to contract:", e.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
