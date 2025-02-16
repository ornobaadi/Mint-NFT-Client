import { FaCube, FaWallet } from "react-icons/fa";

const Navbar = () => {
    const links = <>
        
    </>
    return (
        <div>
            <div className="navbar intertight bg-neutral text-white shadow-sm px-2 md:px-32">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl text-purple-700">
                    <FaCube />
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end">
                    <a className="btn bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] rounded-full text-white font-medium hover:scale-105 transition-all duration-300 border-none shadow-none px-6">
                    <FaWallet />Connect Wallet</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;