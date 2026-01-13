# EduAuthenticate: Institutional Blockchain Credentialing System

EduAuthenticate is a privacy-focused, decentralized application (dApp) designed for universities to issue, manage, and verify academic certificates on the Polygon blockchain (Amoy Testnet).

## 🚀 Key Features

*   **Privacy-First Architecture**: No student names are stored on-chain. Only cryptographic hashes of the certificate data are recorded, ensuring GDPR compliance.
*   **Dual Verification**:
    *   **By ID**: Instant check using a unique Certificate ID.
    *   **By Document**: Drag-and-drop a PDF to verifying its authenticity locally via client-side hashing (SHA-256) against the blockchain registry.
*   **Batch Issuance**: Optimized smart contract allows issuing multiple certificates in a single transaction to save gas.
*   **Revocation**: Institutional administrators can revoke certificates on-chain (e.g., for plagiarism), providing a transparent audit trail.
*   **Role-Based Access Control**: Built on OpenZeppelin's `AccessControl` for secure management of Registrar roles.

## 🛠 Tech Stack

*   **Blockchain**: Solidity (Smart Contracts), Polygon Amoy
*   **Frontend**: React (Vite), Tailwind CSS (Premium UI)
*   **Web3**: Wagmi v2, RainbowKit, Ethers.js v6
*   **Storage**: IPFS (Metadata), On-chain (Hashes)

## 📂 Project Structure

```
EduAuthenticate/
├── frontend/               # React Application
│   ├── src/
│   │   ├── contracts/      # ABIs and Address config
│   │   ├── utils/          # Hashing logic (CryptoJS)
│   │   ├── pages/          # Admin, Verify, Student views
│   │   └── index.css       # Tailwind & Custom styles
├── smart-contracts/        # Hardhat Project
│   ├── contracts/          # Solidity Code
│   ├── scripts/            # Deployment Scripts
│   └── hardhat.config.js   # Amoy Network Config
```

## ⚡ Getting Started

### 1. Smart Contract Setup

```bash
cd smart-contracts
npm install
cp .env.example .env # Add your PRIVATE_KEY
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
```

Copy the deployed address and update `frontend/src/contracts/address.js`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## 🔒 Security & Privacy

*   **Client-Side Hashing**: When verifying by file, the document is hashed in the browser. The file itself is **never uploaded** to our servers.
*   **Immutable Logs**: Every issuance and revocation emits an event for external indexers (The Graph).

## 📜 License

MIT
