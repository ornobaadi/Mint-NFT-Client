import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from './layout/MainLayout.jsx';
import Error from './components/Error.jsx';
import Home from './pages/Home/Home.jsx';

// Import RainbowKit and Wagmi
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  sepolia
} from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const projectId = 'bcb6eed387e269ffa37e899bee166b59';

// Set up wallets
const { connectors } = getDefaultWallets({
  appName: 'MintNFT',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, sepolia]
});

// Create wagmi config
const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, zora, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

// Create a client
const queryClient = new QueryClient();

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={[mainnet, polygon, optimism, arbitrum, base, zora, sepolia]} modalSize="compact">
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </StrictMode>,
);
