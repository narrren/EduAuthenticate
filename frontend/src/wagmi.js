import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonAmoy, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'EduAuthenticate',
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace with valid ID from Cloud.WalletConnect
    chains: [polygonAmoy, hardhat],
    ssr: false,
});
