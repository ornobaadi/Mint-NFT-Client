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
import { sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const projectId = 'bcb6eed387e269ffa37e899bee166b59';

// Configure chains - focusing on Sepolia for NFT minting
const chains = [sepolia];

// Set up wallets with Sepolia as primary chain
const { connectors } = getDefaultWallets({
  appName: 'MintNFT',
  projectId: projectId,
  chains
});

// Create wagmi config with Sepolia focus
const config = createConfig({
  chains,
  transports: {
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
        <RainbowKitProvider chains={chains} modalSize="compact">
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </StrictMode>,
);