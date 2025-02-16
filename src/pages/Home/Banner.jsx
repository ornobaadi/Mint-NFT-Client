// import { CirclePlay, Rocket } from 'lucide-react';
import { FaRocket } from 'react-icons/fa';
import { FaPlayCircle } from 'react-icons/fa';

const Banner = () => {
    return (
        <section className="w-full bg-neutral text-white">
            <div className="intertight max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col items-center space-y-12">
                    {/* Text Content */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                            Discover & Collect Extraordinary NFTs
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                        Enter the world of digital art and collectibles. Explore unique NFTs created by artists worldwide.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <button className="btn bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] rounded-lg text-white font-medium border-none px-6 py-6">
                            <FaRocket /> Start Creating
                            </button>
                            <button className="btn rounded-lg btn-outline px-6 py-6 flex items-center gap-2">
                            <FaPlayCircle />
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;