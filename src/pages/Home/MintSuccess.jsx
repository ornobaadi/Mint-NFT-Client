/* eslint-disable react/prop-types */

const MintSuccess = ({ nft, onReset }) => {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: nft.nftName,
                    text: nft.description,
                    url: nft.metadataUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            console.log('Web Share API not supported');
        }
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md mx-auto text-white shadow-xl border border-green-500">
            <div className="text-green-400 text-center text-xl font-bold mb-4">
                ✔️ NFT Minted Successfully!
            </div>
            <img src={nft.imageUrl} alt="NFT" className="w-full h-48 object-cover rounded-md mb-3" />
            <h2 className="text-lg font-semibold mb-2">{nft.nftName}</h2>
            <p className="text-gray-400 mb-4">{nft.description}</p>
            <div className="flex justify-between items-center">
                <button
                    className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    onClick={handleShare}
                >
                    Share
                </button>
                <button
                    className="bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-500 transition"
                    onClick={onReset}
                >
                    Mint Another
                </button>
            </div>
        </div>
    );
};

export default MintSuccess;
