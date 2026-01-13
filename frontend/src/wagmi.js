import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'EduAuthenticate',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with valid ID from Cloud.WalletConnect
    chains: [sepolia, hardhat],
    ssr: false,
});
