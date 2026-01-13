# 🎓 EduAuthenticate

**EduAuthenticate** is a decentralized application (dApp) built on the **Ethereum/Polygon** blockchain that allows universities to issue tamper-proof digital certificates and enables employers or students to verify them instantly.

---

## 🚀 Live Demo

**Frontend**: [https://edu-authenticate.vercel.app](https://edu-authenticate.vercel.app)  
**Network**: Sepolia Testnet  
**Contract Address**: `0x54EA5D4C25a72DD2000a7a0c7985272e3BF8aB25`

---

## ✨ Features

### 🏛️ For Universities (Admin)
- **Issue Certificates**: Mint new credentials tied to a unique Student ID.
- **Auto-Hashing**: Upload a PDF/Image, and the system automatically calculates its SHA-256 hash to store on-chain (Privacy-preserving).
- **Revocation**: Permanently revoke certificates if needed (e.g., in case of error or fraud).

### 🔍 For Verifiers (Public)
- **Verify by ID**: Instantly check if a Certificate ID (e.g., `EDU-2024-001`) is valid on the blockchain.
- **Verify by Document**: Drag & drop the original PDF file to check its authenticity against the on-chain hash. No files are ever uploaded to a server!
- **Status Check**: See if a credential is Valid, Revoked, or Non-existent.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Blockchain Interaction**: Wagmi, Viem, Ethers.js, RainbowKit
- **Smart Contract**: Solidity (Secure, Role-Based Access Control)
- **Development Environment**: Hardhat
- **Deployment**: Vercel (Frontend), Sepolia Testnet (Contract)

---

## 📦 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/narrren/EduAuthenticate.git
cd EduAuthenticate
```

### 2. Install Dependencies
```bash
# Install Frontend Dependencies
cd frontend
npm install

# Install Smart Contract Dependencies
cd ../smart-contracts
npm install
```

### 3. Local Blockchain (Hardhat)
```bash
cd smart-contracts
npx hardhat node
```

### 4. Deploy Contract
```bash
# In a new terminal
cd smart-contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Run Frontend
```bash
cd frontend
npm run dev
```

---

## 🔐 Smart Contract Details

The smart contract utilizes **Role-Based Access Control (RBAC)** to ensure only authorized University Admins can mint certificates.

- **Storage**: Uses optimizations to store only hashes and metadata URIs on-chain to minimize gas costs.
- **Security**: Includes `ReentrancyGuard` and standard OpenZeppelin implementations.

---

## 📜 License
MIT
