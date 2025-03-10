import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="bg-arcadia-black w-full px-4 py-10">
        <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 justify-items-center text-center">
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/analytics" className="hover:underline">
                            Library Analytics
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>Most Popular Books</li>
                        <li>Highest Rated Books</li>
                        <li>Most Popular Theses</li>
                        <li>Highest Rated Theses</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/circulatoryhistory" className="hover:underline">
                            Circulation
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>Book Checking</li>
                        <li>History</li>
                        <li>Borrowed Books</li>
                        <li>Returned Books</li>
                        <li>Overdue Books</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/bookmanagement" className="hover:underline">
                            Book Management
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>Inventory</li>
                        <li>Add Books</li>
                        <li>Remove Books</li>
                        <li>Modify Books</li>
                        <li>Book Ratings and Reviews</li>
                        <li>Categories</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/researchmanagement" className="hover:underline">
                            Research Management
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>Inventory</li>
                        <li>Add Theses</li>
                        <li>Remove Theses</li>
                        <li>Modify Theses</li>
                        <li>Research Ratings</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/useraccounts" className="hover:underline">
                            User Accounts
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>List of User Accounts</li>
                        <li>List of Admin Accounts</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/support" className="hover:underline">
                            Support
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>User Reports</li>
                        <li>Support Tickets</li>
                        <li>Contacts</li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm text-left font-semibold mb-4 text-white">
                        <Link to="/admin/resevations" className="hover:underline">
                            Reservations
                        </Link>
                    </h4>
                    <ul className="text-sm text-grey text-left space-y-2">
                        <li>Reservation History</li>
                        <li>Room Status</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
