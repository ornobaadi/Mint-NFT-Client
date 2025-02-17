const API_URL = 'http://localhost:5000/api';

/**
 * Service module for interacting with the NFT API
 */
const nftService = {
    /**
     * Store NFT data in the database
     * @param {Object} nftData - The NFT data to store
     * @param {number} nftData.nftId - Unique identifier for the NFT
     * @param {string} nftData.name - Name of the NFT
     * @param {string} nftData.description - Description of the NFT
     * @param {string} nftData.logoUrl - URL to the NFT's image
     * @param {string} nftData.userWalletAddress - Wallet address of the NFT owner
     * @returns {Promise<Object>} Response from the API
     * @throws {Error} If the API call fails
     */
    storeNFT: async (nftData) => {
        try {
            const response = await fetch(`${API_URL}/nft/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nftData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error storing NFT:', error);
            throw new Error(`Failed to store NFT: ${error.message}`);
        }
    },

    /**
     * Retrieve NFT data by ID
     * @param {number} nftId - The ID of the NFT to retrieve
     * @returns {Promise<Object>} The NFT data
     * @throws {Error} If the API call fails
     */
    getNFTById: async (nftId) => {
        try {
            const response = await fetch(`${API_URL}/nft/${nftId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('NFT not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error getting NFT:', error);
            throw new Error(`Failed to retrieve NFT: ${error.message}`);
        }
    },

    /**
     * Retrieve all NFTs owned by a specific wallet address
     * @param {string} walletAddress - The wallet address to query
     * @returns {Promise<Object>} Gallery of NFTs owned by the wallet
     * @throws {Error} If the API call fails
     */
    getNFTGallery: async (walletAddress) => {
        try {
            const response = await fetch(`${API_URL}/nft/gallery/${walletAddress}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('Error getting gallery:', error);
            throw new Error(`Failed to retrieve NFT gallery: ${error.message}`);
        }
    },

    /**
     * Validate NFT data before sending to API
     * @param {Object} nftData - The NFT data to validate
     * @returns {boolean} True if valid, throws error if invalid
     * @throws {Error} If validation fails
     */
    validateNFTData: (nftData) => {
        const requiredFields = ['nftId', 'name', 'description', 'logoUrl', 'userWalletAddress'];

        for (const field of requiredFields) {
            if (!nftData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        if (typeof nftData.nftId !== 'number') {
            throw new Error('nftId must be a number');
        }

        if (typeof nftData.userWalletAddress !== 'string' || !nftData.userWalletAddress.startsWith('0x')) {
            throw new Error('Invalid wallet address format');
        }

        return true;
    }
};

export default nftService;
