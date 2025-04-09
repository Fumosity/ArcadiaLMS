import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp, FaEnvelope, FaFacebookSquare } from "react-icons/fa";

const UFooter = () => {
    const navigate = useNavigate();
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const handleLinkClick = () => setTimeout(scrollToTop, 100);

    // Navigation handlers
    const navigateWithQuery = (path, query) => {
        navigate(`${path}?view=${query}`);
        scrollToTop();
    };

    return (
        <footer className="bg-arcadia-black text-white w-full px-6 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                {/* Logo and About Column (Left) */}
                <div className="md:w-1/3">
                    <div className="flex items-center mb-6">
                        <img
                            src="/image/logo_user.png"
                            alt="Library Logo"
                            className="h-12"
                        />
                    </div>

                    <p className="text-md leading-relaxed mb-2">
                        A Library Management System for the Academic Resource Center owned by: <br />
                        <b>Lyceum of the Philippines University of Cavite</b>
                    </p>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <FaEnvelope size={20} className="text-gray-300" />
                            <span className="text-sm">cav-arc@lpu.edu.ph</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaFacebookSquare size={20} className="text-blue-500" />
                            <a
                                href="https://www.facebook.com/LPUCaviteARC"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:text-gray-300 transition"
                            >
                                facebook.com/LPUCaviteARC
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content Columns (Right) */}
                <div className="flex-1 flex justify-end border-l border-gray-700 pl-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {/* Resources Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Resources</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>
                                    <button 
                                        onClick={() => navigateWithQuery("/user/bookmanagement", "mostPopular")}
                                        className="hover:text-white transition text-left w-full"
                                    >
                                        Most Popular Books
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigateWithQuery("/user/bookmanagement", "highlyRated")}
                                        className="hover:text-white transition text-left w-full"
                                    >
                                        Highest Rated Books
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => navigateWithQuery("/user/researchmanagement", "recommended")}
                                        className="hover:text-white transition text-left w-full"
                                    >
                                        Recommended Research
                                    </button>
                                </li>
                                <li>
                                    <Link 
                                        to="/user/faqs" 
                                        className="hover:text-white transition block"
                                        onClick={handleLinkClick}
                                    >
                                        FAQs
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Services</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {/* <li>
                                    <Link 
                                        to="/user/reservations#reserv-a-room" 
                                        className="hover:text-white transition block"
                                        onClick={() => {
                                            setTimeout(() => {
                                                const element = document.getElementById("reserv-a-room");
                                                element?.scrollIntoView({ behavior: "smooth" });
                                            }, 100);
                                        }}
                                    >
                                        Reserve A Room
                                    </Link>
                                </li> */}
                                <li>
                                    <Link 
                                        to="/user/reservations" 
                                        className="hover:text-white transition block"
                                        onClick={handleLinkClick}
                                    >
                                        View Reservation Schedule
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/user/services" 
                                        className="hover:text-white transition block"
                                        onClick={handleLinkClick}
                                    >
                                        All Services
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Account Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Account</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>
                                    <Link 
                                        to="/user/accountview" 
                                        className="hover:text-white transition block"
                                        onClick={handleLinkClick}
                                    >
                                        View Account
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/user/accountview" 
                                        className="hover:text-white transition block"
                                        onClick={() => {
                                            const middle = Math.floor(document.documentElement.scrollHeight / 2);
                                            window.scrollTo({ top: middle, behavior: "smooth" });
                                        }}
                                    >
                                        Circulation History
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/user/support" 
                                        className="hover:text-white transition block"
                                        onClick={handleLinkClick}
                                    >
                                        Support Center
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-16 right-6 bg-arcadia-red hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all"
                aria-label="Back to top"
            >
                <FaArrowUp size={20} />
            </button>
        </footer>
    );
};

export default UFooter;