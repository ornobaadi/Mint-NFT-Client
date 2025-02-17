import { useState, useEffect } from 'react';
import { FaCube } from 'react-icons/fa';
import { useAccount, useContractWrite, usePublicClient } from 'wagmi';
import { toast } from 'react-toastify';
import { useConfig } from 'wagmi';
import MintSuccess from './MintSuccess';

const CONTRACT_ADDRESS = '0x743f49311a82fe72eb474c44e78da2a6e0ae951c';
const CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "string", "name": "metadataUrl", "type": "string" }
        ],
        "name": "mint",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "checkId",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const API_BASE_URL = 'https://mint-nft-server.vercel.app/api/nft';

const Mint = () => {
    const [formData, setFormData] = useState({
        nftName: '',
        description: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [mintingStep, setMintingStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mintedNFT, setMintedNFT] = useState(null);
    const [currentTokenId, setCurrentTokenId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const config = useConfig();

    // Use the contract write hook to prepare the transaction but don't execute it immediately
    const { 
        write, 
        data: mintData, 
        isLoading: isMinting, 
        isSuccess, 
        error,
        status
    } = useContractWrite({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'mint',
        onError: (error) => {
            console.error('Contract write error:', error);
            toast.error(`Minting failed: ${error.message || 'Unknown error'}`);
            setErrorMessage(`Minting failed: ${error.message || 'Unknown error'}`);
            setIsLoading(false);
            setMintingStep(0);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleMintSuccess = async (txHash) => {
        try {
            const receipt = await publicClient.waitForTransactionReceipt({ 
                hash: txHash 
            });

            if (receipt.status === 'success' || receipt.status === 1) {
                const response = await fetch(`${API_BASE_URL}/${currentTokenId}`);
                const nftData = await response.json();
                
                if (nftData.status === 'success') {
                    setMintedNFT(nftData.data);
                    setShowSuccess(true);
                    toast.success('NFT minted successfully!');
                }
            } else {
                throw new Error('Transaction failed');
            }
        } catch (error) {
            console.error('Error processing mint transaction:', error);
            toast.error('Error processing mint transaction');
            setErrorMessage('Transaction failed. Please try again.');
        } finally {
            setIsLoading(false);
            setMintingStep(0);
        }
    };

    // Monitor transaction success and handle accordingly
    useEffect(() => {
        if (isSuccess && mintData) {
            handleMintSuccess(mintData.hash);
        }
    }, [isSuccess, mintData]);

    const generateUniqueId = async () => {
        setMintingStep(1);
        let isUnique = false;
        let newId;

        while (!isUnique) {
            newId = Math.floor(Math.random() * 1000000) + 1;
            try {
                const data = await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'checkId',
                    args: [BigInt(newId)],
                });

                if (!data) {
                    isUnique = true;
                }
            } catch (error) {
                console.error('Error checking ID:', error);
                throw new Error('Failed to generate unique ID');
            }
        }
        return newId;
    };

    const storeNFTData = async (id) => {
        setMintingStep(2);
        try {
            const response = await fetch(`${API_BASE_URL}/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    nftId: id,
                    name: formData.nftName,
                    description: formData.description,
                    logoUrl: formData.imageUrl || 'https://via.placeholder.com/500',
                    userWalletAddress: address
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.message || 'Failed to store NFT data');
            }
        } catch (error) {
            console.error('Error storing NFT data:', error);
            toast.error('Failed to store NFT data: ' + error.message);
            setErrorMessage('Failed to store NFT data: ' + error.message);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous errors

        if (!isConnected) {
            toast.warning('Please connect your wallet first');
            setErrorMessage('Please connect your wallet first');
            return;
        }

        if (config.state.chainId !== 11155111) {
            toast.error('Please switch to Sepolia network');
            setErrorMessage('Please switch to Sepolia network');
            return;
        }

        if (!formData.nftName || !formData.description) {
            toast.warning('Name and description are required');
            setErrorMessage('Name and description are required');
            return;
        }

        setIsLoading(true);

        try {
            // Generate unique ID
            const tokenId = await generateUniqueId();
            setCurrentTokenId(tokenId);

            // Store NFT metadata
            await storeNFTData(tokenId);

            // Prepare metadata URL
            const metadataUrl = `${API_BASE_URL}/${tokenId}`;

            // Initiate minting transaction
            setMintingStep(3);
            
            // Call the write function with proper arguments
            // The critical part: Execute the write function from wagmi
            write?.({
                args: [BigInt(tokenId), metadataUrl]
            });

            // Success/error will be handled by the useEffect and onError callback
            
        } catch (error) {
            console.error('Error in minting process:', error);
            toast.error(`Minting failed: ${error.message}`);
            setErrorMessage(`Minting failed: ${error.message}`);
            setIsLoading(false);
            setMintingStep(0);
        }
    };

    const resetForm = () => {
        setFormData({
            nftName: '',
            description: '',
            imageUrl: ''
        });
        setShowSuccess(false);
        setMintedNFT(null);
        setCurrentTokenId(null);
        setErrorMessage('');
    };

    if (showSuccess && mintedNFT) {
        return <MintSuccess nft={mintedNFT} onReset={resetForm} />;
    }

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

                        {errorMessage && (
                            <div className="alert alert-error shadow-lg">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errorMessage}</span>
                                </div>
                            </div>
                        )}

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

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn h-12 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none font-semibold text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isLoading || !isConnected || isMinting}
                            >
                                {isLoading || isMinting ? (
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