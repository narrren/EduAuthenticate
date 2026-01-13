import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './wagmi';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import Verify from './pages/Verify';
import StudentPortal from './pages/StudentPortal';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="verify" element={<Verify />} />
                <Route path="verify/:certId" element={<Verify />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="student" element={<StudentPortal />} />
              </Route>
            </Routes>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
