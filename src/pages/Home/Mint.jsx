import { useState } from 'react';
import { FaCube } from 'react-icons/fa';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import { toast } from 'react-toastify';
import { readContract } from '@wagmi/core';
import nftService from '../../services/api';
import { sepolia } from 'viem/chains';

const CONTRACT_ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "checkId",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "string", "name": "metadataUrl", "type": "string" }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const CONTRACT_ADDRESS = '0x743f49311a82fe72eb474c44e78da2a6e0ae951c';
const BASE_URL = 'http://localhost:5000/api/nft';

const Mint = () => {
    const [formData, setFormData] = useState({
        nftName: '',
        description: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [mintingStep, setMintingStep] = useState(0);
    const [nftId, setNftId] = useState(null);

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();

    const { writeAsync: mintNFT } = useContractWrite({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mint',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            nftName: '',
            description: '',
            imageUrl: ''
        });
        setIsLoading(false);
        setMintingStep(0);
        setNftId(null);
    };

    const generateUniqueId = async () => {
        setMintingStep(1);
        let isUnique = false;
        let newId;

        while (!isUnique) {
            newId = Math.floor(Math.random() * 1000000) + 1;
            try {
                const exists = await readContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'checkId',
                    args: [BigInt(newId)],
                });

                if (!exists) {
                    isUnique = true;
                    setNftId(newId);
                }
            } catch (error) {
                console.error('Error checking ID:', error);
                toast.error('Error generating unique ID');
                setIsLoading(false);
                return null;
            }
        }
        return newId;
    };

    const storeNFTData = async (id) => {
        setMintingStep(2);
        try {
            console.log('Storing NFT data for ID:', id);
            const nftData = {
                nftId: id,
                name: formData.nftName,
                description: formData.description,
                logoUrl: formData.imageUrl || 'https://via.placeholder.com/500',
                userWalletAddress: address
            };

            console.log('NFT Data to store:', nftData);
            const response = await nftService.storeNFT(nftData);
            console.log('Store NFT response:', response);

            if (response.status === 'success') {
                toast.success('NFT data stored in database!');
                return true;
            } else {
                throw new Error(response.message || 'Failed to store NFT data');
            }
        } catch (error) {
            console.error('Error storing NFT data:', error);
            toast.error('Failed to store NFT data: ' + error.message);
            throw error;
        }
    };

    const performMint = async (id) => {
        setMintingStep(3);
        const metadataUrl = `${BASE_URL}/${id}`;

        try {
            console.log('Starting mint process for ID:', id);

            // Perform the blockchain mint
            const data = await mintNFT({
                args: [BigInt(id), metadataUrl],
            });

            const receipt = await publicClient.waitForTransactionReceipt({ hash: data.hash });
            console.log('Transaction receipt:', receipt);

            // After successful blockchain mint, store in database
            const storeResult = await storeNFTData(id);
            if (storeResult) {
                toast.success('NFT successfully minted and stored in database!');
                resetForm();
            }

            return true;
        } catch (error) {
            console.error('Error in minting process:', error);
            toast.error('Error during minting process: ' + error.message);
            setIsLoading(false);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            toast.warning('Please connect your wallet first');
            return;
        }

        if (!formData.nftName || !formData.description) {
            toast.warning('Name and description are required');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Starting submission process');
            const uniqueId = await generateUniqueId();
            if (!uniqueId) {
                setIsLoading(false);
                return;
            }

            await performMint(uniqueId);
        } catch (error) {
            console.error('Error in submission process:', error);
            toast.error('Error during minting process: ' + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="intertight min-h-screen flex items-center justify-center p-4 bg-neutral">
            <div className="w-full max-w-3xl">
                <div className="card bg-opacity-10 backdrop-blur-lg border border-opacity-10 border-gray-700 shadow-2xl">
                    <form className="card-body p-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-left text-white">
                                Mint Your NFT
                            </h2>
                        </div>

                        {/* NFT Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300 font-medium">NFT Name</span>
                                <span className="label-text-alt text-gray-300">(Required)</span>
                            </label>
                            <input
                                type="text"
                                name="nftName"
                                required
                                placeholder="Enter NFT name"
                                className="input bg-[#1C1C24] border-none text-white placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.nftName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300 font-medium">Description</span>
                                <span className="label-text-alt text-gray-300">(Required)</span>
                            </label>
                            <textarea
                                name="description"
                                required
                                placeholder="Describe your NFT..."
                                className="textarea bg-[#1C1C24] border-none min-h-[120px] text-white placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-gray-300">Image URL</span>
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                placeholder="Enter image URL"
                                className="input bg-[#1C1C24] border-none text-white placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Minting Status */}
                        {isLoading && (
                            <div className="mt-4">
                                <div className="flex flex-col space-y-2 text-white">
                                    <span className="text-sm font-medium">Minting Progress:</span>
                                    <div className="relative pt-1">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-[#1C1C24]">
                                            <div
                                                style={{ width: `${(mintingStep / 3) * 100}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-xs">
                                        {mintingStep === 1 && "Generating unique NFT ID..."}
                                        {mintingStep === 2 && "Storing NFT metadata..."}
                                        {mintingStep === 3 && "Finalizing on blockchain..."}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn h-12 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none font-semibold text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || !isConnected}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Minting...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <FaCube className="mr-2" /> Mint NFT
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mint;
