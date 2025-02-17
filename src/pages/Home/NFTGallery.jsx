import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const NFTGallery = () => {
    const { isConnected } = useAccount();
    const [nfts, setNfts] = useState([]);
    const defaultImage = "/fallback-image.jpg";

    useEffect(() => {
        // Simulate fetching NFTs
        // Here you would normally fetch NFTs from your backend or blockchain
        // For now, we'll just set an empty array to simulate no NFTs
        setNfts([]);
    }, [isConnected]);

    return (
        <div className="bg-neutral px-2 lg:px-32 p-6">
            <div className="mb-8">
                <h2 className="text-white text-3xl font-semibold">Your NFT Gallery</h2>
            </div>
            {isConnected ? (
                nfts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                        {nfts.map((nft) => (
                            <div
                                key={nft.nftId}
                                className="card bg-neutral text-white border border-gray-700 w-full shadow-sm transition-transform transform hover:scale-105 duration-300"
                            >
                                <figure>
                                    <img
                                        src={nft.logoUrl || defaultImage}
                                        alt={nft.name}
                                        className="w-full h-60 object-cover rounded-t-xl"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{nft.name}</h2>
                                    <p>{nft.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-400 text-center pb-5">
                        It looks like you haven't added any NFTs to your collection yet.  To get started, please use the widget above to add your first NFT.
                    </p>
                )
            ) : (
                <p className="mt-4 text-gray-400 text-center pb-5">Connect your wallet to see your NFTs.</p>
            )}
        </div>
    );
};

export default NFTGallery;
