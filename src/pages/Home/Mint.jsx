import { useState } from 'react';
import { FaCube } from 'react-icons/fa';

const Mint = () => {
    const [formData, setFormData] = useState({
        nftName: '',
        description: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="intertight min-h-screen flex items-center justify-center p-4 bg-neutral">
            <div className="w-full max-w-3xl">
                <div className="card bg-opacity-10 backdrop-blur-lg border border-opacity-10 border-gray-700 shadow-2xl">
                    <form className="card-body p-8 space-y-6">
                        <h2 className="text-3xl font-bold text-left mb-8 text-white">
                            Mint Your NFT
                        </h2>

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
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn h-12 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none font-semibold text-lg"
                            >
                                <FaCube /> Mint NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Mint;