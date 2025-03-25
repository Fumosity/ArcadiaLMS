import { Link } from "react-router-dom";
import { FaArrowUp, FaEnvelope, FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLinkClick = () => {
        setTimeout(scrollToTop, 100);
    };

    return (
        <footer className="bg-arcadia-black text-white w-full px-6 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                {/* Logo and About Column (Left) */}
                <div className="md:w-1/3">
                    {/* Logo */}
                    <div className="flex items-center mb-6">
                        <img
                            src="/image/logo_user.png"
                            alt="Arcadia Admin Logo"
                            className="h-12"
                        />
                    </div>

                    {/* Description */}
                    <p className="text-md leading-relaxed mb-2">
                        A Library Management System for the Academic Resource Center owned by: <br />
                        <b>Lyceum of the Philippines University of Cavite</b>
                    </p>

                    {/* Contact Info */}
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
                <div className="flex-1 flex justify-end border-l items-center">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {/* Analytics & Circulation Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Data & Analytics</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link to="/admin/" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Library Analytics
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/circulationhistory" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Circulation History
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/systemreports" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        System Reports
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Management Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Management</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link to="/admin/bookmanagement" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Book Management
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/researchmanagement" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Research Management
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/useraccounts" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        User Accounts
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/reservations" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Room Reservations
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div className="min-w-[160px]">
                            <h3 className="font-bold text-lg mb-4">Support</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link to="/admin/support" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Support Center
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/schedule" className="hover:text-gray-300" onClick={handleLinkClick}>
                                        Schedule Management
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
                className="fixed bottom-16 right-6 bg-arcadia-red hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
                aria-label="Back to top"
            >
                <FaArrowUp size={20} />
            </button>
        </footer>
    );
};

export default Footer;
