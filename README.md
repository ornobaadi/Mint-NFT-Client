# NFT Minting Application

## Overview

This repository contains the frontend codebase for an NFT minting application. The application allows users to connect their wallets, mint new NFTs, and view their NFT gallery. The frontend interacts with a backend API to store and retrieve NFT metadata.

## Features

- Connect wallet using MetaMask.
- Mint new NFTs with unique metadata.
- View a gallery of minted NFTs.
- Responsive design and user-friendly interface.

## API Routes

The frontend interacts with the following backend API routes:

- **Store NFT Data**: `POST /api/nft/store`
  - Stores NFT metadata in the database.
- **Get NFT Data By ID**: `GET /api/nft/:nftId`
  - Retrieves NFT data using the NFT ID.
- **Get NFT Gallery**: `GET /api/nft/gallery/:userWalletAddress`
  - Retrieves all NFTs owned by a specific wallet address.

## Deployed Links

- **Frontend**: [Deployed Frontend Link](https://mint-nft-cytric.web.app/)
- **Backend API**: [Deployed API Link](https://mint-nft-server.vercel.app/)
- **Looms Video**: [Looms Video Link](https://drive.google.com/drive/folders/1467O39o5D0cypT6788cydCOPl6rFo7eR?usp=sharing)

## Repositories

- **Backend Repository**: [Backend GitHub Repository](https://github.com/ornobaadi/Mint-NFT-Server)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ornobaadi/Mint-NFT-Client.git
   cd Mint-NFT-Client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables, such as API URLs and wallet configurations.

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Technologies Used

- **Frontend**: React.js
- **Wallet Integration**: Wagmi, RainbowKit
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
