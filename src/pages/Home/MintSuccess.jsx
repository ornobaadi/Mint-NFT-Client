/* eslint-disable react/prop-types */
import { FaCheckCircle, FaExternalLinkAlt, FaRedo } from 'react-icons/fa';

const MintSuccess = ({ nft, onReset }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-neutral">
            <div className="w-full max-w-3xl">
                <div className="card bg-opacity-10 backdrop-blur-lg border border-opacity-10 border-gray-700 shadow-2xl">
                    <div className="card-body p-8 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <FaCheckCircle className="text-6xl text-green-500" />
                            </div>

                            <h2 className="text-3xl font-bold text-white">
                                NFT Minted Successfully!
                            </h2>

                            <p className="text-gray-300">
                                Your NFT has been minted and stored on the blockchain
                            </p>
                        </div>

                        <div className="bg-[#1C1C24] rounded-lg p-6 space-y-4">
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">NFT Name</p>
                                <p className="text-white font-semibold">{nft.name}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Description</p>
                                <p className="text-white">{nft.description}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">NFT ID</p>
                                <p className="text-white font-mono">{nft.nftId}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Owner Address</p>
                                <p className="text-white font-mono truncate">
                                    {nft.userWalletAddress}
                                </p>
                            </div>

                            {nft.logoUrl && (
                                <div className="mt-4">
                                    <img
                                        src={nft.logoUrl}
                                        alt={nft.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/500';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                                onClick={onReset}
                                className="btn bg-[#1C1C24] text-white hover:bg-[#2C2C34] flex-1 h-12"
                            >
                                <FaRedo className="mr-2" /> Mint Another
                            </button>

                            <a
                                href={nft.metadataUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none flex-1 h-12"
                            >
                                <FaExternalLinkAlt className="mr-2" /> View Metadata
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MintSuccess;